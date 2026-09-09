import { ActionStatus } from "@/generated/prisma/enums";
import { prisma } from "@/prisma/prisma";
import { ActionItem } from "../types/action";
import { actionRepository } from "./action";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    actionItem: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const mockActionItems = [
  {
    id: "1",
    title: "Fix login bug",
    ownerId: "member-1",
    status: ActionStatus.OPEN,
    dueDate: "2026-09-10",
    owner: {
      id: "member-1",
      name: "Tom",
    },
  },
  {
    id: "2",
    title: "Update documentation",
    ownerId: "member-2",
    status: ActionStatus.CLOSED,
    dueDate: "2026-09-15",
    owner: {
      id: "member-2",
      name: "John",
    },
  },
];

describe("Action Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Get Actions", () => {
    it("should return all actions", async () => {
      jest
        .mocked(prisma.actionItem.findMany)
        .mockResolvedValue(mockActionItems as never);

      const data = await actionRepository.getActions();

      expect(data).toEqual(mockActionItems);

      expect(prisma.actionItem.findMany).toHaveBeenCalledWith({
        include: {
          owner: true,
        },
      });
    });
  });

  describe("Get Action", () => {
    it("should return the correct action when the id exists", async () => {
      const mockAction = mockActionItems[0];

      jest
        .mocked(prisma.actionItem.findFirst)
        .mockResolvedValue(mockAction as never);

      const data = await actionRepository.getAction("1");

      expect(data).toEqual(mockAction);

      expect(prisma.actionItem.findFirst).toHaveBeenCalledWith({
        where: {
          id: "1",
        },
        include: {
          owner: true,
        },
      });
    });

    it("should return null when the action does not exist", async () => {
      jest.mocked(prisma.actionItem.findFirst).mockResolvedValue(null);

      const data = await actionRepository.getAction("999");

      expect(data).toBeNull();

      expect(prisma.actionItem.findFirst).toHaveBeenCalledWith({
        where: {
          id: "999",
        },
        include: {
          owner: true,
        },
      });
    });
  });

  describe("Create Action", () => {
    it("should create an action successfully", async () => {
      const mockAction: ActionItem = {
        id: "3",
        title: "Implement dashboard",
        ownerId: "member-1",
        status: ActionStatus.OPEN,
        dueDate: "2026-09-20",
      };

      jest
        .mocked(prisma.actionItem.create)
        .mockResolvedValue(mockAction as never);

      await actionRepository.createAction(mockAction);

      expect(prisma.actionItem.create).toHaveBeenCalledWith({
        data: mockAction,
      });
    });
  });

  describe("Edit Action", () => {
    it("should edit an action successfully", async () => {
      const updatedAction: ActionItem = {
        id: "999",
        title: "Fix login bug - updated",
        ownerId: "member-2",
        status: ActionStatus.CLOSED,
        dueDate: "2026-09-30",
      };

      jest
        .mocked(prisma.actionItem.update)
        .mockResolvedValue(updatedAction as never);

      await actionRepository.editAction("1", updatedAction);

      expect(prisma.actionItem.update).toHaveBeenCalledWith({
        where: {
          id: "1",
          ownerId: "member-2",
        },
        data: updatedAction,
      });
    });
  });

  describe("Count Actions By Status", () => {
    it("should return the correct count for a status", async () => {
      jest.mocked(prisma.actionItem.count).mockResolvedValue(3);

      const data = await actionRepository.countActionsByStatus(
        ActionStatus.OPEN,
      );

      expect(data).toBe(3);

      expect(prisma.actionItem.count).toHaveBeenCalledWith({
        where: {
          status: ActionStatus.OPEN,
        },
      });
    });
  });
});
