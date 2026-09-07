import { actionItems } from "../data/action";
import { ActionItem } from "../types/action";

export const actionRepository = {
  getActions: (): ActionItem[] => {
    return actionItems;
  },
  getAction: (id: string): ActionItem | undefined => {
    return actionItems.find((actionItem) => actionItem.id === id);
  },
  createAction: (actionItem: ActionItem): void => {
    actionItems.push(actionItem);
  },
  editAction: (id: string, newActionItem: ActionItem): number => {
    const index = actionItems.findIndex((actionItem) => actionItem.id === id);
    if (index !== -1) {
      actionItems[index] = { ...newActionItem, id };
    }
    return index;
  },
};
