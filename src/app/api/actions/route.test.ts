import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { ActionStatus } from "@/generated/prisma/enums";
import { actionService } from "@/src/services/action";
import { verifySession } from "@/src/utils/session";
import { ActionItemWithOwner } from "@/src/types/action";

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
  beforeEach(() => {
    jest.clearAllMocks();

    mockedVerifySession.mockResolvedValue({
      isAuth: true,
      name: "Test User",
      id: "member-1",
    });
  });

  it("should return all actions successfully", async () => {
    const mockActions: ActionItemWithOwner[] = [
      {
        id: "act-1",
        title: "Setup CI pipeline",
        ownerId: "member-1",
        status: ActionStatus.OPEN,
        dueDate: "2026-09-17",
        owner: {
          name: "Jake",
          id: "member-1",
          roleId: "role-1",
          timezone: "utc",
          email: "jake@email.com",
        },
      },
      {
        id: "act-2",
        title: "Design dashboard",
        ownerId: "member-2",
        status: ActionStatus.CLOSED,
        dueDate: "2026-09-21",
        owner: {
          name: "Jose",
          id: "member-2",
          roleId: "role-1",
          timezone: "utc",
          email: "jose@email.com",
        },
      },
    ];

    mockedActionService.getActions.mockResolvedValue(mockActions);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      actions: mockActions,
    });

    expect(mockedActionService.getActions).toHaveBeenCalledTimes(1);
  });

  it("should return an empty array when there are no actions", async () => {
    mockedActionService.getActions.mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      actions: [],
    });

    expect(mockedActionService.getActions).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if user is not logged in", async () => {
    mockedVerifySession.mockResolvedValue({
      isAuth: false,
      name: null,
      id: null,
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);

    expect(data).toEqual({
      errors: "Unauthorized. Please log in.",
    });

    expect(mockedActionService.getActions).not.toHaveBeenCalled();
  });

  it("should return 500 when getting actions fails", async () => {
    mockedActionService.getActions.mockRejectedValue(
      new Error("Database error"),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);

    expect(data).toEqual({
      errors: "Something went wrong. Please try again later.",
    });

    expect(mockedActionService.getActions).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/actions", () => {
  const baseUrl = "http://localhost:3000/api/actions";

  beforeEach(() => {
    jest.clearAllMocks();

    mockedVerifySession.mockResolvedValue({
      isAuth: true,
      name: "Test User",
      id: "member-1",
    });
  });

  const mockValidAction = {
    title: "Design actions",
    ownerId: "member-2",
    status: ActionStatus.OPEN,
    dueDate: "2026-09-23",
  };

  it("should create an action successfully", async () => {
    mockedActionService.createAction.mockResolvedValue("generated-action-id");

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

  describe("Validation", () => {
    it("should return validation error when title is missing", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    it("should return validation error when title is invalid", async () => {
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

    it("should return validation error when due date format is invalid", async () => {
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

    it("should return validation error when due date is invalid", async () => {
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

    it("should return validation error when status is invalid", async () => {
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

  it("should return 500 when creating an action fails", async () => {
    mockedActionService.createAction.mockRejectedValue(
      new Error("Database error"),
    );

    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(mockValidAction),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);

    expect(data).toEqual({
      errors: "Something went wrong. Please try again later.",
    });

    expect(mockedActionService.createAction).toHaveBeenCalledWith(
      mockValidAction,
    );

    expect(mockedActionService.createAction).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if user is not logged in", async () => {
    mockedVerifySession.mockResolvedValue({
      isAuth: false,
      name: null,
      id: null,
    });

    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(mockValidAction),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);

    expect(data).toEqual({
      errors: "Unauthorized. Please log in.",
    });

    expect(mockedActionService.createAction).not.toHaveBeenCalled();
  });
});
