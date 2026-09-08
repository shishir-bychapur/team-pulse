import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { ActionItem, ActionStatus } from "@/src/types/action";
import { actionService } from "@/src/services/action";
import { verifySession } from "@/src/utils/session";

jest.mock("@/src/services/action", () => ({
  actionService: {
    getActions: jest.fn(),
    createAction: jest.fn(),
  },
}));

jest.mock("@/src/utils/session", () => ({
  verifySession: jest.fn(),
}));

const mockedActionService = actionService as jest.Mocked<typeof actionService>;
const mockedVerifySession = jest.mocked(verifySession);

describe("GET /api/actions", () => {
  const baseUrl = "http://localhost:3000/api/actions";

  beforeEach(() => {
    jest.clearAllMocks();

    mockedVerifySession.mockResolvedValue({
      isAuth: true,
      username: "test@test.com",
    });
  });

  it("should return all actions successfully", async () => {
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

    mockedActionService.getActions.mockReturnValue(mockActions);
    const req = new NextRequest(baseUrl);

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      actions: mockActions,
    });

    expect(mockedActionService.getActions).toHaveBeenCalledTimes(1);
  });

  it("should return an empty array when there are no actions", async () => {
    mockedActionService.getActions.mockReturnValue([]);

    const req = new NextRequest(baseUrl);

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      actions: [],
    });

    expect(mockedActionService.getActions).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/actions", () => {
  const baseUrl = "http://localhost:3000/api/actions";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockValidAction = {
    title: "Design actions",
    ownerId: "member-2",
    status: ActionStatus.OPEN,
    dueDate: "2026-09-23",
  };

  it("should create an action successfully", async () => {
    mockedActionService.createAction.mockReturnValue("generated-action-id");

    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(mockValidAction),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      id: "generated-action-id",
    });

    expect(mockedActionService.createAction).toHaveBeenCalledWith(
      mockValidAction,
    );

    expect(mockedActionService.createAction).toHaveBeenCalledTimes(1);
  });

  describe("should return validation error when", () => {
    it("title is missing", async () => {
      const { title, ...invalidAction } = mockValidAction;

      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify(invalidAction),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toBeDefined();

      expect(mockedActionService.createAction).not.toHaveBeenCalled();
    });

    it("title is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({
          ...mockValidAction,
          title: "",
        }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toBeDefined();

      expect(mockedActionService.createAction).not.toHaveBeenCalled();
    });

    it("due date is in the correct format but invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({
          ...mockValidAction,
          dueDate: "2026-15-41",
        }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toBeDefined();

      expect(mockedActionService.createAction).not.toHaveBeenCalled();
    });

    it("due date is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({
          ...mockValidAction,
          dueDate: "2026",
        }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toBeDefined();

      expect(mockedActionService.createAction).not.toHaveBeenCalled();
    });

    it("status is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({
          ...mockValidAction,
          status: "PENDING",
        }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toBeDefined();

      expect(mockedActionService.createAction).not.toHaveBeenCalled();
    });
  });

  it("should return 403 when the owner does not exist", async () => {
    mockedActionService.createAction.mockImplementation(() => {
      throw new Error("There is no member with the given ownerId!");
    });

    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(mockValidAction),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(403);

    expect(data).toEqual({
      errors: "There is no member with the given ownerId!",
    });

    expect(mockedActionService.createAction).toHaveBeenCalledWith(
      mockValidAction,
    );
  });
});
