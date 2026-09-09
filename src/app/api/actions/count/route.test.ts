import { NextRequest } from "next/server";
import { GET } from "./route";
import { ActionItem } from "@/src/types/action";
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
  const baseUrl = "http://localhost:3000/api/actions";

  beforeEach(() => {
    jest.clearAllMocks();

    mockedVerifySession.mockResolvedValue({
      isAuth: true,
      username: "test@test.com",
    });
  });

  it("should return open status actions successfully", async () => {
    mockedActionService.getActionsByStatus.mockReturnValue(Promise.resolve(1));
    const req = new NextRequest(baseUrl + "?status=OPEN");

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      count: 1,
    });

    expect(mockedActionService.getActionsByStatus).toHaveBeenCalledTimes(1);
  });

  it("should return closed status actions successfully", async () => {
    const mockActions: ActionItem[] = [
      {
        id: "act-1",
        title: "Setup CI pipeline",
        ownerId: "member-1",
        status: ActionStatus.OPEN,
        dueDate: "2026-09-17",
      },
      {
        id: "act-2",
        title: "Design dashboard",
        ownerId: "member-2",
        status: ActionStatus.CLOSED,
        dueDate: "2026-09-21",
      },
    ];

    mockedActionService.getActionsByStatus.mockReturnValue(Promise.resolve(1));
    const req = new NextRequest(baseUrl + "?status=CLOSED");

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      count: 1,
    });

    expect(mockedActionService.getActionsByStatus).toHaveBeenCalledTimes(1);
  });

  it("should return 400 if status query is incorrect", async () => {
    mockedActionService.getActionsByStatus.mockReturnValue(Promise.resolve(0));
    const req = new NextRequest(baseUrl + "?status=Missing");

    const response = await GET(req);

    expect(response.status).toBe(400);
    expect(mockedActionService.getActionsByStatus).toHaveBeenCalledTimes(0);
  });

  it("should return 400 if status query is missing", async () => {
    mockedActionService.getActionsByStatus.mockReturnValue(Promise.resolve(0));
    const req = new NextRequest(baseUrl);

    const response = await GET(req);

    expect(response.status).toBe(400);
    expect(mockedActionService.getActionsByStatus).toHaveBeenCalledTimes(0);
  });

  it("should return 401 if user is not logged in", async () => {
    mockedVerifySession.mockResolvedValue({
      isAuth: false,
      username: null,
    });

    mockedActionService.getActionsByStatus.mockReturnValue(Promise.resolve(0));
    const req = new NextRequest(baseUrl);

    const response = await GET(req);

    expect(response.status).toBe(401);
    expect(mockedActionService.getActionsByStatus).toHaveBeenCalledTimes(0);
  });
});
