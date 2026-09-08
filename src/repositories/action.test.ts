import { ActionItem } from "../types/action";
import { actionRepository } from "./action";
import { actionItems } from "../data/action";
import { ActionStatus } from "@/generated/prisma/enums";

const mockActionItems: ActionItem[] = [
  {
    id: "1",
    title: "Fix login bug",
    ownerId: "member-1",
    status: ActionStatus.OPEN,
    dueDate: "2026-09-10",
  },
  {
    id: "2",
    title: "Update documentation",
    ownerId: "member-2",
    status: ActionStatus.CLOSED,
    dueDate: "2026-09-15",
  },
];

jest.mock("../data/action", () => ({
  actionItems: [],
}));

describe("Action Repository", () => {
  beforeEach(() => {
    actionItems.length = 0;
    actionItems.push(...mockActionItems);
  });

  describe("Get Actions", () => {
    it("should return all actions", () => {
      const data = actionRepository.getActions();

      expect(data).toHaveLength(2);
      expect(data).toEqual(mockActionItems);
    });
  });

  describe("Get Action", () => {
    it("should return the correct action when the id exists", () => {
      const data = actionRepository.getAction("1");

      expect(data).toEqual({
        id: "1",
        title: "Fix login bug",
        ownerId: "member-1",
        status: ActionStatus.OPEN,
        dueDate: "2026-09-10",
      });
    });

    it("should return undefined when the id does not exist", () => {
      const data = actionRepository.getAction("999");

      expect(data).toBeUndefined();
    });
  });

  describe("Create Action", () => {
    it("should create an action successfully", () => {
      const mockAction: ActionItem = {
        id: "3",
        title: "Implement dashboard",
        ownerId: "member-1",
        status: ActionStatus.OPEN,
        dueDate: "2026-09-20",
      };

      expect(actionItems).toHaveLength(2);

      actionRepository.createAction(mockAction);

      expect(actionItems).toHaveLength(3);
      expect(actionItems).toContainEqual(mockAction);
    });
  });

  describe("Edit Action", () => {
    it("should edit an action successfully", () => {
      const updatedAction: ActionItem = {
        id: "999",
        title: "Fix login bug - updated",
        ownerId: "member-2",
        status: ActionStatus.CLOSED,
        dueDate: "2026-09-30",
      };

      const index = actionRepository.editAction("1", updatedAction);

      expect(index).toBe(0);

      expect(actionItems[0]).toEqual({
        id: "1",
        title: "Fix login bug - updated",
        ownerId: "member-2",
        status: ActionStatus.CLOSED,
        dueDate: "2026-09-30",
      });
    });

    it("should return -1 when the action does not exist", () => {
      const updatedAction: ActionItem = {
        id: "999",
        title: "Does not exist",
        ownerId: "member-1",
        status: ActionStatus.OPEN,
        dueDate: "2026-09-30",
      };

      const index = actionRepository.editAction("999", updatedAction);

      expect(index).toBe(-1);

      expect(actionItems).toEqual(mockActionItems);
    });
  });
});
