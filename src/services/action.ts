import { actionRepository } from "../repositories/action";
import { ActionItem, ActionItemWithOwner } from "../types/action";
import { ActionStatus } from "@/generated/prisma/enums";

export const actionService = {
  getActions: async (): Promise<ActionItemWithOwner[]> => {
    return await actionRepository.getActions();
  },
  getAction: async (id: string): Promise<ActionItemWithOwner | null> => {
    return await actionRepository.getAction(id);
  },
  getActionsByStatus: async (status: ActionStatus): Promise<number> => {
    return await actionRepository.countActionsByStatus(status);
  },
  createAction: async (actionItem: ActionItem): Promise<string> => {
    const id = crypto.randomUUID();
    await actionRepository.createAction({ ...actionItem, id });
    return id;
  },
  editAction: async (id: string, newActionItem: ActionItem): Promise<void> => {
    return await actionRepository.editAction(id, newActionItem);
  },
};
