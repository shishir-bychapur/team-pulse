import { NextRequest } from "next/server";
import { GET, PATCH } from "./route";
import { actionService } from "@/src/services/action";
import { verifySession } from "@/src/utils/session";
import { ActionStatus } from "@/generated/prisma/enums";
import { ActionItemWithOwner } from "@/src/types/action";

jest.mock("@/src/services/action", () => ({
  actionService: {
    getAction: jest.fn(),
    editAction: jest.fn(),
  },
}));

jest.mock("@/src/utils/session", () => ({
  verifySession: jest.fn(),
}));

const mockedActionService = actionService as jest.Mocked<typeof actionService>;
const mockedVerifySession = jest.mocked(verifySession);

describe("GET /api/actions/[id]", () => {
  const baseUrl = "http://localhost:3000/api/actions";

  beforeEach(() => {
    jest.clearAllMocks();

    mockedVerifySession.mockResolvedValue({
      isAuth: true,
      name: "Test User",
      id: "member-1",
    });
  });

  it("should return status 200 and the action when it exists", async () => {
    const mockAction: ActionItemWithOwner = {
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
    };

    mockedActionService.getAction.mockResolvedValue(mockAction);

    const req = new NextRequest(`${baseUrl}/act-1`);
    const params = Promise.resolve({ id: "act-1" });

    const response = await GET(req, { params });
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      action: mockAction,
    });

    expect(mockedActionService.getAction).toHaveBeenCalledWith("act-1");
    expect(mockedActionService.getAction).toHaveBeenCalledTimes(1);
  });

  it("should return status 404 and null when the action does not exist", async () => {
    mockedActionService.getAction.mockResolvedValue(null);

    const req = new NextRequest(`${baseUrl}/invalid-id`);
    const params = Promise.resolve({
      id: "invalid-id",
    });

    const response = await GET(req, { params });
    const data = await response.json();

    expect(response.status).toBe(404);

    expect(data).toEqual({
      action: null,
    });

    expect(mockedActionService.getAction).toHaveBeenCalledWith("invalid-id");
  });

  it("should return status 401 if the user is not logged in", async () => {
    mockedVerifySession.mockResolvedValue({
      isAuth: false,
      name: null,
      id: null,
    });

    const req = new NextRequest(`${baseUrl}/act-1`);
    const params = Promise.resolve({ id: "act-1" });

    const response = await GET(req, { params });
    const data = await response.json();

    expect(response.status).toBe(401);

    expect(data).toEqual({
      errors: "Unauthorized. Please log in.",
    });

    expect(mockedActionService.getAction).not.toHaveBeenCalled();
  });

  it("should return status 500 when the service throws an error", async () => {
    mockedActionService.getAction.mockRejectedValue(
      new Error("Database error"),
    );

    const req = new NextRequest(`${baseUrl}/act-1`);
    const params = Promise.resolve({ id: "act-1" });

    const response = await GET(req, { params });
    const data = await response.json();

    expect(response.status).toBe(500);

    expect(data).toEqual({
      errors: "Something went wrong. Please try again later.",
    });

    expect(mockedActionService.getAction).toHaveBeenCalledWith("act-1");
  });
});

describe("PATCH /api/actions/[id]", () => {
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

  it("should update an existing action successfully", async () => {
    mockedActionService.editAction.mockResolvedValue(undefined);

    const req = new NextRequest(`${baseUrl}/act-1`, {
      method: "PATCH",
      body: JSON.stringify(mockValidAction),
    });

    const params = Promise.resolve({ id: "act-1" });

    const response = await PATCH(req, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({});

    expect(mockedActionService.editAction).toHaveBeenCalledWith(
      "act-1",
      mockValidAction,
    );

    expect(mockedActionService.editAction).toHaveBeenCalledTimes(1);
  });

  it("should return status 401 if the user is not logged in", async () => {
    mockedVerifySession.mockResolvedValue({
      isAuth: false,
      name: null,
      id: null,
    });

    const req = new NextRequest(`${baseUrl}/act-1`, {
      method: "PATCH",
      body: JSON.stringify(mockValidAction),
    });

    const params = Promise.resolve({ id: "act-1" });

    const response = await PATCH(req, { params });
    const data = await response.json();

    expect(response.status).toBe(401);

    expect(data).toEqual({
      errors: "Unauthorized. Please log in.",
    });

    expect(mockedActionService.editAction).not.toHaveBeenCalled();
  });

  describe("should return validation error when", () => {
    it("title is missing", async () => {
      const { title, ...invalidAction } = mockValidAction;

      const req = new NextRequest(`${baseUrl}/act-1`, {
        method: "PATCH",
        body: JSON.stringify(invalidAction),
      });

      const params = Promise.resolve({ id: "act-1" });

      const response = await PATCH(req, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toBeDefined();

      expect(mockedActionService.editAction).not.toHaveBeenCalled();
    });

    it("title is invalid", async () => {
      const req = new NextRequest(`${baseUrl}/act-1`, {
        method: "PATCH",
        body: JSON.stringify({
          ...mockValidAction,
          title: "",
        }),
      });

      const params = Promise.resolve({ id: "act-1" });

      const response = await PATCH(req, { params });

      expect(response.status).toBe(400);

      expect(mockedActionService.editAction).not.toHaveBeenCalled();
    });

    it("due date has the correct format but is invalid", async () => {
      const req = new NextRequest(`${baseUrl}/act-1`, {
        method: "PATCH",
        body: JSON.stringify({
          ...mockValidAction,
          dueDate: "2026-15-41",
        }),
      });

      const params = Promise.resolve({ id: "act-1" });

      const response = await PATCH(req, { params });

      expect(response.status).toBe(400);

      expect(mockedActionService.editAction).not.toHaveBeenCalled();
    });

    it("due date is invalid", async () => {
      const req = new NextRequest(`${baseUrl}/act-1`, {
        method: "PATCH",
        body: JSON.stringify({
          ...mockValidAction,
          dueDate: "2026",
        }),
      });

      const params = Promise.resolve({ id: "act-1" });

      const response = await PATCH(req, { params });

      expect(response.status).toBe(400);

      expect(mockedActionService.editAction).not.toHaveBeenCalled();
    });

    it("status is invalid", async () => {
      const req = new NextRequest(`${baseUrl}/act-1`, {
        method: "PATCH",
        body: JSON.stringify({
          ...mockValidAction,
          status: "PENDING",
        }),
      });

      const params = Promise.resolve({ id: "act-1" });

      const response = await PATCH(req, { params });

      expect(response.status).toBe(400);

      expect(mockedActionService.editAction).not.toHaveBeenCalled();
    });
  });

  it("should return status 500 when the service throws an error", async () => {
    mockedActionService.editAction.mockRejectedValue(
      new Error("Database error"),
    );

    const req = new NextRequest(`${baseUrl}/act-1`, {
      method: "PATCH",
      body: JSON.stringify(mockValidAction),
    });

    const params = Promise.resolve({ id: "act-1" });

    const response = await PATCH(req, { params });
    const data = await response.json();

    expect(response.status).toBe(500);

    expect(data).toEqual({
      errors: "Something went wrong. Please try again later.",
    });

    expect(mockedActionService.editAction).toHaveBeenCalledWith(
      "act-1",
      mockValidAction,
    );
  });
});
