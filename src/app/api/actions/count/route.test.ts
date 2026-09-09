import { NextRequest } from "next/server";
import { GET } from "./route";
import { ActionStatus } from "@/generated/prisma/enums";
import { actionService } from "@/src/services/action";
import { verifySession } from "@/src/utils/session";

jest.mock("@/src/services/action", () => ({
  actionService: {
    getActionsByStatus: jest.fn(),
  },
}));

jest.mock("@/src/utils/session", () => ({
  verifySession: jest.fn(),
}));

const mockedActionService = actionService as jest.Mocked<typeof actionService>;
const mockedVerifySession = jest.mocked(verifySession);

describe("GET /api/actions/count", () => {
  const baseUrl = "http://localhost:3000/api/actions/count";

  beforeEach(() => {
    jest.clearAllMocks();

    mockedVerifySession.mockResolvedValue({
      isAuth: true,
      name: "Test User",
      id: "member-1",
    });
  });

  it("should return open action count successfully", async () => {
    mockedActionService.getActionsByStatus.mockResolvedValue(1);

    const req = new NextRequest(`${baseUrl}?status=OPEN`);

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      count: 1,
    });

    expect(mockedActionService.getActionsByStatus).toHaveBeenCalledWith(
      ActionStatus.OPEN,
    );

    expect(mockedActionService.getActionsByStatus).toHaveBeenCalledTimes(1);
  });

  it("should return closed action count successfully", async () => {
    mockedActionService.getActionsByStatus.mockResolvedValue(1);

    const req = new NextRequest(`${baseUrl}?status=CLOSED`);

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      count: 1,
    });

    expect(mockedActionService.getActionsByStatus).toHaveBeenCalledWith(
      ActionStatus.CLOSED,
    );

    expect(mockedActionService.getActionsByStatus).toHaveBeenCalledTimes(1);
  });

  it("should return 400 when status query is invalid", async () => {
    const req = new NextRequest(`${baseUrl}?status=INVALID`);

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);

    expect(data).toEqual({
      errors: "Invalid status.",
    });

    expect(mockedActionService.getActionsByStatus).not.toHaveBeenCalled();
  });

  it("should return 400 when status query is missing", async () => {
    const req = new NextRequest(baseUrl);

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);

    expect(data).toEqual({
      errors: "Invalid status.",
    });

    expect(mockedActionService.getActionsByStatus).not.toHaveBeenCalled();
  });

  it("should return 401 when user is not logged in", async () => {
    mockedVerifySession.mockResolvedValue({
      isAuth: false,
      name: null,
      id: null,
    });

    const req = new NextRequest(`${baseUrl}?status=OPEN`);

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);

    expect(data).toEqual({
      errors: "Unauthorized. Please log in.",
    });

    expect(mockedActionService.getActionsByStatus).not.toHaveBeenCalled();
  });

  it("should return 500 when the service throws an error", async () => {
    mockedActionService.getActionsByStatus.mockRejectedValue(
      new Error("Database error"),
    );

    const req = new NextRequest(`${baseUrl}?status=OPEN`);

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(500);

    expect(data).toEqual({
      errors: "Something went wrong. Please try again later.",
    });

    expect(mockedActionService.getActionsByStatus).toHaveBeenCalledWith(
      ActionStatus.OPEN,
    );
  });
});
