import { NextRequest } from "next/server";
import { GET, PATCH } from "./route";
import { ActionItem, ActionStatus } from "@/src/types/action";
import { actionService } from "@/src/services/action";
import { verifySession } from "@/src/utils/session";

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
      username: "test@test.com",
    });
  });

  it("should return status 200 and the action when it exists", async () => {
    const mockAction: ActionItem = {
      id: "act-1",
      title: "Setup CI pipeline",
      ownerId: "member-1",
      status: ActionStatus.OPEN,
      dueDate: "2026-09-17",
    };

    mockedActionService.getAction.mockReturnValue(mockAction);

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
    mockedActionService.getAction.mockReturnValue(undefined);

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
      username: null,
    });
    const req = new NextRequest(`${baseUrl}/act-1`);
    const params = Promise.resolve({ id: "act-1" });

    const response = await GET(req, { params });

    expect(response.status).toBe(401);
  });
});

describe("PATCH /api/actions/[id]", () => {
  const baseUrl = "http://localhost:3000/api/actions";

  beforeEach(() => {
    jest.clearAllMocks();
    mockedVerifySession.mockResolvedValue({
      isAuth: true,
      username: "test@test.com",
    });
  });

  const mockValidAction = {
    title: "Design actions",
    ownerId: "member-2",
    status: ActionStatus.OPEN,
    dueDate: "2026-09-23",
  };

  it("should update an existing action successfully", async () => {
    mockedActionService.editAction.mockReturnValue(0);

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
      username: null,
    });

    const req = new NextRequest(`${baseUrl}/act-1`, {
      method: "PATCH",
      body: JSON.stringify(mockValidAction),
    });

    const params = Promise.resolve({ id: "act-1" });

    const response = await PATCH(req, { params });

    expect(response.status).toBe(401);
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

    it("due date is in the correct format but invalid", async () => {
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

  it("should return 404 when the action does not exist", async () => {
    mockedActionService.editAction.mockReturnValue(-1);

    const req = new NextRequest(`${baseUrl}/invalid-id`, {
      method: "PATCH",
      body: JSON.stringify(mockValidAction),
    });

    const params = Promise.resolve({
      id: "invalid-id",
    });

    const response = await PATCH(req, { params });
    const data = await response.json();

    expect(response.status).toBe(404);

    expect(data).toEqual({
      errors: "There is no action item with the given id!",
    });

    expect(mockedActionService.editAction).toHaveBeenCalledWith(
      "invalid-id",
      mockValidAction,
    );
  });

  it("should return 403 when the owner does not exist", async () => {
    mockedActionService.editAction.mockImplementation(() => {
      throw new Error("There is no member with the given ownerId!");
    });

    const req = new NextRequest(`${baseUrl}/act-1`, {
      method: "PATCH",
      body: JSON.stringify(mockValidAction),
    });

    const params = Promise.resolve({ id: "act-1" });

    const response = await PATCH(req, { params });
    const data = await response.json();

    expect(response.status).toBe(403);

    expect(data).toEqual({
      errors: "There is no member with the given ownerId!",
    });

    expect(mockedActionService.editAction).toHaveBeenCalledWith(
      "act-1",
      mockValidAction,
    );
  });
});
