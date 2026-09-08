import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { updateService } from "@/src/services/update";
import { verifySession } from "@/src/utils/session";
import { Mood } from "@/generated/prisma/enums";
import { Update } from "@/generated/prisma/client";

jest.mock("@/src/services/update", () => ({
  updateService: {
    getUpdates: jest.fn(),
    createUpdate: jest.fn(),
  },
}));

jest.mock("@/src/utils/session", () => ({
  verifySession: jest.fn(),
}));

const mockedVerifySession = jest.mocked(verifySession);

const mockedUpdateService = updateService as jest.Mocked<typeof updateService>;

describe("GET /api/updates", () => {
  const baseUrl = "http://localhost:3000/api/updates";

  beforeEach(() => {
    jest.clearAllMocks();
    mockedVerifySession.mockResolvedValue({
      isAuth: true,
      username: "test@test.com",
    });
  });

  it("should return updates successfully", async () => {
    const mockUpdates: Update[] = [
      {
        id: "1",
        memberId: "member-1",
        mood: Mood.GREEN,
        date: "2026-09-01",
        text: "Update 1",
      },
      {
        id: "2",
        memberId: "member-2",
        mood: Mood.RED,
        date: "2026-09-02",
        text: "Update 2",
      },
    ];

    mockedUpdateService.getUpdates.mockReturnValue(mockUpdates);

    const req = new NextRequest(baseUrl);

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      updates: mockUpdates,
    });

    expect(mockedUpdateService.getUpdates).toHaveBeenCalledTimes(1);
  });

  it("should return status 401 if the user is not logged in", async () => {
    mockedVerifySession.mockResolvedValue({
      isAuth: false,
      username: null,
    });
    mockedUpdateService.getUpdates.mockReturnValue([]);

    const req = new NextRequest(baseUrl);

    const response = await GET(req);

    expect(response.status).toBe(401);
    expect(mockedUpdateService.getUpdates).toHaveBeenCalledTimes(0);
  });

  it("should pass the request URL to the update service", async () => {
    mockedUpdateService.getUpdates.mockReturnValue([]);

    const req = new NextRequest(
      `${baseUrl}?members=member-1&moods=GREEN&date=2026-09-01`,
    );

    await GET(req);

    expect(mockedUpdateService.getUpdates).toHaveBeenCalledTimes(1);

    const passedUrl = mockedUpdateService.getUpdates.mock.calls[0][0];

    expect(passedUrl.searchParams.getAll("members")).toEqual(["member-1"]);

    expect(passedUrl.searchParams.getAll("moods")).toEqual(["GREEN"]);

    expect(passedUrl.searchParams.get("date")).toBe("2026-09-01");
  });
});

describe("POST /api/updates", () => {
  const baseUrl = "http://localhost:3000/api/updates";

  beforeEach(() => {
    jest.clearAllMocks();
    mockedVerifySession.mockResolvedValue({
      isAuth: true,
      username: "test@test.com",
    });
  });

  const mockValidUpdate = {
    memberId: "member-1",
    date: "2026-09-01",
    text: "Worked on next.js routing.",
    mood: Mood.RED,
  };

  it("should create an update successfully", async () => {
    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(mockValidUpdate),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({});

    expect(mockedUpdateService.createUpdate).toHaveBeenCalledWith(
      mockValidUpdate,
    );

    expect(mockedUpdateService.createUpdate).toHaveBeenCalledTimes(1);
  });

  it("should return status 401 if the user is not logged in", async () => {
    mockedVerifySession.mockResolvedValue({
      isAuth: false,
      username: null,
    });
    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(mockValidUpdate),
    });

    const response = await POST(req);

    expect(response.status).toBe(401);
    expect(mockedUpdateService.createUpdate).toHaveBeenCalledTimes(0);
  });

  describe("should return validation error when", () => {
    it("memberId is missing", async () => {
      const { memberId, ...invalidUpdate } = mockValidUpdate;

      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify(invalidUpdate),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);

      expect(data.errors).toBeDefined();

      expect(mockedUpdateService.createUpdate).not.toHaveBeenCalled();
    });

    it("date is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({
          ...mockValidUpdate,
          date: "-1",
        }),
      });

      const response = await POST(req);

      expect(response.status).toBe(400);

      expect(mockedUpdateService.createUpdate).not.toHaveBeenCalled();
    });

    it("date has the correct format but is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({
          ...mockValidUpdate,
          date: "2026-15-41",
        }),
      });

      const response = await POST(req);

      expect(response.status).toBe(400);

      expect(mockedUpdateService.createUpdate).not.toHaveBeenCalled();
    });

    it("text is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({
          ...mockValidUpdate,
          text: "",
        }),
      });

      const response = await POST(req);

      expect(response.status).toBe(400);

      expect(mockedUpdateService.createUpdate).not.toHaveBeenCalled();
    });

    it("mood is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({
          ...mockValidUpdate,
          mood: "WHITE",
        }),
      });

      const response = await POST(req);

      expect(response.status).toBe(400);

      expect(mockedUpdateService.createUpdate).not.toHaveBeenCalled();
    });
  });

  it("should return 403 when the member does not exist", async () => {
    mockedUpdateService.createUpdate.mockImplementation(() => {
      throw new Error("There is no member with the given memberId!");
    });

    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(mockValidUpdate),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(403);

    expect(data).toEqual({
      errors: "There is no member with the given memberId!",
    });

    expect(mockedUpdateService.createUpdate).toHaveBeenCalledWith(
      mockValidUpdate,
    );
  });
});
