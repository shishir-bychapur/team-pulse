import { actionService } from "./action";
import { actionRepository } from "../repositories/action";
import { ActionStatus } from "@/generated/prisma/enums";
import { ActionItem, ActionItemWithOwner } from "../types/action";
import { revalidateTag } from "next/cache";

jest.mock("next/cache", () => ({
  unstable_cache: <T extends (...args: unknown[]) => unknown>(fn: T): T => fn,
  revalidateTag: jest.fn(),
}));

jest.mock("../repositories/action", () => ({
  actionRepository: {
    getActions: jest.fn(),
    getAction: jest.fn(),
    countActionsByStatus: jest.fn(),
    createAction: jest.fn(),
    editAction: jest.fn(),
  },
}));

const mockedActionRepository = actionRepository as jest.Mocked<
  typeof actionRepository
>;

const mockedRevalidateTag = revalidateTag as jest.MockedFunction<
  typeof revalidateTag
>;

describe("Action Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAction: ActionItem = {
    id: "action-1",
    title: "Fix login bug",
    ownerId: "member-1",
    status: ActionStatus.OPEN,
    dueDate: "2026-09-10",
  };

  const mockActionWithOwner: ActionItemWithOwner = {
    ...mockAction,
    owner: {
      id: "member-1",
      name: "Jake",
      email: "jake@example.com",
      roleId: "role-1",
      timezone: "UTC",
    },
  };

  describe("Get Actions", () => {
    it("should return all actions", async () => {
      const mockActions: ActionItemWithOwner[] = [
        mockActionWithOwner,
        {
          id: "action-2",
          title: "Update documentation",
          ownerId: "member-2",
          status: ActionStatus.CLOSED,
          dueDate: "2026-09-15",
          owner: {
            id: "member-2",
            name: "Jose",
            email: "jose@example.com",
            roleId: "role-2",
            timezone: "UTC",
          },
        },
      ];

      mockedActionRepository.getActions.mockResolvedValue(mockActions);

      const result = await actionService.getActions();

      expect(result).toEqual(mockActions);
      expect(result).toHaveLength(2);

      expect(mockedActionRepository.getActions).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array when there are no actions", async () => {
      mockedActionRepository.getActions.mockResolvedValue([]);

      const result = await actionService.getActions();

      expect(result).toEqual([]);
      expect(mockedActionRepository.getActions).toHaveBeenCalledTimes(1);
    });
  });

  describe("Get Action", () => {
    it("should return an action when it exists", async () => {
      mockedActionRepository.getAction.mockResolvedValue(mockActionWithOwner);

      const result = await actionService.getAction("action-1");

      expect(result).toEqual(mockActionWithOwner);

      expect(mockedActionRepository.getAction).toHaveBeenCalledWith("action-1");
      expect(mockedActionRepository.getAction).toHaveBeenCalledTimes(1);
    });

    it("should return null when the action does not exist", async () => {
      mockedActionRepository.getAction.mockResolvedValue(null);

      const result = await actionService.getAction("invalid-id");

      expect(result).toBeNull();

      expect(mockedActionRepository.getAction).toHaveBeenCalledWith(
        "invalid-id",
      );
    });
  });

  describe("Get Actions By Status", () => {
    it("should return the number of open actions", async () => {
      mockedActionRepository.countActionsByStatus.mockResolvedValue(2);

      const result = await actionService.getActionsByStatus(ActionStatus.OPEN);

      expect(result).toBe(2);

      expect(mockedActionRepository.countActionsByStatus).toHaveBeenCalledWith(
        ActionStatus.OPEN,
      );
    });

    it("should return the number of closed actions", async () => {
      mockedActionRepository.countActionsByStatus.mockResolvedValue(1);

      const result = await actionService.getActionsByStatus(
        ActionStatus.CLOSED,
      );

      expect(result).toBe(1);

      expect(mockedActionRepository.countActionsByStatus).toHaveBeenCalledWith(
        ActionStatus.CLOSED,
      );
    });

    it("should return zero when there are no actions with the given status", async () => {
      mockedActionRepository.countActionsByStatus.mockResolvedValue(0);

      const result = await actionService.getActionsByStatus(ActionStatus.OPEN);

      expect(result).toBe(0);

      expect(mockedActionRepository.countActionsByStatus).toHaveBeenCalledWith(
        ActionStatus.OPEN,
      );
    });
  });

  describe("Create Action", () => {
    it("should generate an ID and create an action successfully", async () => {
      const mockUUID = "generated-action-id";

      jest.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID);

      mockedActionRepository.createAction.mockResolvedValue();

      const result = await actionService.createAction(mockAction);

      expect(mockedActionRepository.createAction).toHaveBeenCalledWith({
        ...mockAction,
        id: mockUUID,
      });

      expect(mockedActionRepository.createAction).toHaveBeenCalledTimes(1);

      expect(result).toBe(mockUUID);

      expect(mockedRevalidateTag).toHaveBeenCalledWith("actions", "max");
      expect(mockedRevalidateTag).toHaveBeenCalledTimes(1);
    });

    it("should generate a new UUID instead of using the provided action ID", async () => {
      const mockUUID = "new-generated-id";

      jest.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID);

      mockedActionRepository.createAction.mockResolvedValue();

      const actionWithOldId: ActionItem = {
        ...mockAction,
        id: "old-id",
      };

      const result = await actionService.createAction(actionWithOldId);

      expect(mockedActionRepository.createAction).toHaveBeenCalledWith({
        ...actionWithOldId,
        id: mockUUID,
      });

      expect(result).toBe(mockUUID);
      expect(result).not.toBe("old-id");

      expect(mockedRevalidateTag).toHaveBeenCalledWith("actions", "max");
      expect(mockedRevalidateTag).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when the repository fails to create the action", async () => {
      jest.spyOn(crypto, "randomUUID").mockReturnValue("generated-id");

      mockedActionRepository.createAction.mockRejectedValue(
        new Error("Database error"),
      );

      await expect(actionService.createAction(mockAction)).rejects.toThrow(
        "Database error",
      );

      expect(mockedRevalidateTag).not.toHaveBeenCalled();
    });
  });

  describe("Edit Action", () => {
    it("should edit an action successfully", async () => {
      const updatedAction: ActionItem = {
        id: "action-1",
        title: "Fix login bug - updated",
        ownerId: "member-1",
        status: ActionStatus.CLOSED,
        dueDate: "2026-09-30",
      };

      mockedActionRepository.editAction.mockResolvedValue();

      await actionService.editAction("action-1", updatedAction);

      expect(mockedActionRepository.editAction).toHaveBeenCalledWith(
        "action-1",
        updatedAction,
      );

      expect(mockedActionRepository.editAction).toHaveBeenCalledTimes(1);

      expect(mockedRevalidateTag).toHaveBeenCalledWith("actions", "max");
      expect(mockedRevalidateTag).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when the repository fails to edit the action", async () => {
      const updatedAction: ActionItem = {
        ...mockAction,
        title: "Updated action",
      };

      mockedActionRepository.editAction.mockRejectedValue(
        new Error("Action not found"),
      );

      await expect(
        actionService.editAction("invalid-id", updatedAction),
      ).rejects.toThrow("Action not found");

      expect(mockedActionRepository.editAction).toHaveBeenCalledWith(
        "invalid-id",
        updatedAction,
      );

      expect(mockedRevalidateTag).not.toHaveBeenCalled();
    });
  });
});
