import { ActionStatus } from "@/generated/prisma/enums";
import { ActionItem, ActionItemWithOwner } from "../types/action";
import { prisma } from "@/prisma/prisma";

export const actionRepository = {
  getActions: async (): Promise<ActionItemWithOwner[]> => {
    return await prisma.actionItem.findMany({
      include: {
        owner: true,
      },
    });
  },
  getAction: async (id: string): Promise<ActionItemWithOwner | null> => {
    return await prisma.actionItem.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        owner: true,
      },
    });
  },
  createAction: async (actionItem: ActionItem): Promise<void> => {
    await prisma.actionItem.create({
      data: actionItem,
    });
  },
  editAction: async (id: string, newActionItem: ActionItem): Promise<void> => {
    await prisma.actionItem.update({
      where: {
        id,
        ownerId: newActionItem.ownerId,
      },
      data: newActionItem,
    });
  },
  countActionsByStatus: async (status: ActionStatus): Promise<number> => {
    return await prisma.actionItem.count({
      where: {
        status,
      },
    });
  },
};
