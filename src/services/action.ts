import { unstable_cache, revalidateTag } from "next/cache";
import { actionRepository } from "../repositories/action";
import { ActionItem, ActionItemWithOwner } from "../types/action";
import { ActionStatus } from "@/generated/prisma/enums";

const getCachedActions = unstable_cache(
  async (): Promise<ActionItemWithOwner[]> => {
    return await actionRepository.getActions();
  },
  ["actions"],
  {
    revalidate: 86400, // 1 day
    tags: ["actions"],
  },
);

const getCachedAction = unstable_cache(
  async (id: string): Promise<ActionItemWithOwner | null> => {
    return await actionRepository.getAction(id);
  },
  ["action"],
  {
    revalidate: 86400, // 1 day
    tags: ["actions"],
  },
);

const getCachedActionsByStatus = unstable_cache(
  async (status: ActionStatus): Promise<number> => {
    return await actionRepository.countActionsByStatus(status);
  },
  ["actions-by-status"],
  {
    revalidate: 86400, // 1 day
    tags: ["actions"],
  },
);

export const actionService = {
  getActions: (): Promise<ActionItemWithOwner[]> => {
    return getCachedActions();
  },

  getAction: (id: string): Promise<ActionItemWithOwner | null> => {
    return getCachedAction(id);
  },

  getActionsByStatus: (status: ActionStatus): Promise<number> => {
    return getCachedActionsByStatus(status);
  },

  createAction: async (actionItem: ActionItem): Promise<string> => {
    const id = crypto.randomUUID();

    await actionRepository.createAction({
      ...actionItem,
      id,
    });

    // Clear cached action data after successful creation
    revalidateTag("actions", "max");

    return id;
  },

  editAction: async (id: string, newActionItem: ActionItem): Promise<void> => {
    await actionRepository.editAction(id, newActionItem);

    // Clear cached action data after successful edit
    revalidateTag("actions", "max");
  },
};
