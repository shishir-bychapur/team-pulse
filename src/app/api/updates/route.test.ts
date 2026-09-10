/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { updateService } from "@/src/services/update";
import { verifySession } from "@/src/utils/session";
import { Mood } from "@/generated/prisma/enums";

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
      name: "test",
      id: "123",
    });
  });

  it("should return updates successfully", async () => {
    const mockUpdates = [
      {
        id: "1",
        memberId: "member-1",
        mood: Mood.GREEN,
        date: "2026-09-01",
        text: "Update 1",
        member: {
          id: "member-1",
          name: "Tom",
          email: "tom@example.com",
          password: "hashed-password",
          roleId: "role-1",
          timezone: "UTC",
        },
      },
      {
        id: "2",
        memberId: "member-2",
        mood: Mood.RED,
        date: "2026-09-02",
        text: "Update 2",
        member: {
          id: "member-2",
          name: "Harry",
          email: "harry@example.com",
          password: "hashed-password",
          roleId: "role-2",
          timezone: "UTC",
        },
      },
    ];

    mockedUpdateService.getUpdates.mockResolvedValue(mockUpdates);

    const req = new NextRequest(baseUrl);

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      updates: mockUpdates,
    });

    expect(mockedVerifySession).toHaveBeenCalledTimes(1);

    expect(mockedUpdateService.getUpdates).toHaveBeenCalledWith([], [], null);

    expect(mockedUpdateService.getUpdates).toHaveBeenCalledTimes(1);
  });

  it("should pass member, mood and date filters to the update service", async () => {
    mockedUpdateService.getUpdates.mockResolvedValue([]);

    const req = new NextRequest(
      `${baseUrl}?members=member-1&members=member-2&moods=GREEN&moods=RED&date=2026-09-01`,
    );

    await GET(req);

    expect(mockedUpdateService.getUpdates).toHaveBeenCalledWith(
      ["member-1", "member-2"],
      ["GREEN", "RED"],
      "2026-09-01",
    );

    expect(mockedUpdateService.getUpdates).toHaveBeenCalledTimes(1);
  });

  it("should pass an empty member array when no member filter is provided", async () => {
    mockedUpdateService.getUpdates.mockResolvedValue([]);

    const req = new NextRequest(`${baseUrl}?moods=GREEN&date=2026-09-01`);

    await GET(req);

    expect(mockedUpdateService.getUpdates).toHaveBeenCalledWith(
      [],
      ["GREEN"],
      "2026-09-01",
    );
  });

  it("should pass an empty mood array when no mood filter is provided", async () => {
    mockedUpdateService.getUpdates.mockResolvedValue([]);

    const req = new NextRequest(`${baseUrl}?members=member-1&date=2026-09-01`);

    await GET(req);

    expect(mockedUpdateService.getUpdates).toHaveBeenCalledWith(
      ["member-1"],
      [],
      "2026-09-01",
    );
  });

  it("should pass null when no date filter is provided", async () => {
    mockedUpdateService.getUpdates.mockResolvedValue([]);

    const req = new NextRequest(`${baseUrl}?members=member-1&moods=GREEN`);

    await GET(req);

    expect(mockedUpdateService.getUpdates).toHaveBeenCalledWith(
      ["member-1"],
      ["GREEN"],
      null,
    );
  });

  it("should return an empty array when no updates are found", async () => {
    mockedUpdateService.getUpdates.mockResolvedValue([]);

    const req = new NextRequest(baseUrl);

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      updates: [],
    });
  });

  it("should return status 401 when the user is not authenticated", async () => {
    mockedVerifySession.mockResolvedValue({
      isAuth: false,
      name: null,
      id: null,
    });

    const req = new NextRequest(baseUrl);

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);

    expect(data).toEqual({
      errors: "Unauthorized. Please log in.",
    });

    expect(mockedUpdateService.getUpdates).not.toHaveBeenCalled();
  });

  it("should throw when the update service fails", async () => {
    mockedUpdateService.getUpdates.mockRejectedValue(
      new Error("Database error"),
    );

    const req = new NextRequest(baseUrl);

    await expect(GET(req)).rejects.toThrow("Database error");
  });
});

describe("POST /api/updates", () => {
  const baseUrl = "http://localhost:3000/api/updates";

  beforeEach(() => {
    jest.clearAllMocks();

    mockedVerifySession.mockResolvedValue({
      isAuth: true,
      name: "test",
      id: "1",
    });
  });

  const mockValidUpdate = {
    memberId: "member-1",
    date: "2026-09-01",
    text: "Worked on Next.js routing.",
    mood: Mood.RED,
  };

  it("should create an update successfully", async () => {
    mockedUpdateService.createUpdate.mockResolvedValue();

    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(mockValidUpdate),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({});

    expect(mockedVerifySession).toHaveBeenCalledTimes(1);

    expect(mockedUpdateService.createUpdate).toHaveBeenCalledWith(
      mockValidUpdate,
    );

    expect(mockedUpdateService.createUpdate).toHaveBeenCalledTimes(1);
  });

  it("should return status 401 when the user is not authenticated", async () => {
    mockedVerifySession.mockResolvedValue({
      isAuth: false,
      name: null,
      id: null,
    });

    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(mockValidUpdate),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);

    expect(data).toEqual({
      errors: "Unauthorized. Please log in.",
    });

    expect(mockedUpdateService.createUpdate).not.toHaveBeenCalled();
  });

  describe("Validation", () => {
    it("should return 400 when memberId is missing", async () => {
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

    it("should return 400 when date format is invalid", async () => {
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

    it("should return 400 when date has an invalid value", async () => {
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

    it("should return 400 when text is empty", async () => {
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

    it("should return 400 when mood is invalid", async () => {
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

    it("should return 400 when text is missing", async () => {
      const { text, ...invalidUpdate } = mockValidUpdate;

      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify(invalidUpdate),
      });

      const response = await POST(req);

      expect(response.status).toBe(400);

      expect(mockedUpdateService.createUpdate).not.toHaveBeenCalled();
    });

    it("should return 400 when mood is missing", async () => {
      const { mood, ...invalidUpdate } = mockValidUpdate;

      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify(invalidUpdate),
      });

      const response = await POST(req);

      expect(response.status).toBe(400);

      expect(mockedUpdateService.createUpdate).not.toHaveBeenCalled();
    });

    it("should return 400 when date is missing", async () => {
      const { date, ...invalidUpdate } = mockValidUpdate;

      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify(invalidUpdate),
      });

      const response = await POST(req);

      expect(response.status).toBe(400);

      expect(mockedUpdateService.createUpdate).not.toHaveBeenCalled();
    });
  });

  it("should return 500 when creating the update fails", async () => {
    mockedUpdateService.createUpdate.mockRejectedValue(
      new Error("Database error"),
    );

    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(mockValidUpdate),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);

    expect(data).toEqual({
      errors: "Something went wrong. Please try again later.",
    });

    expect(mockedUpdateService.createUpdate).toHaveBeenCalledWith(
      mockValidUpdate,
    );
  });
});
