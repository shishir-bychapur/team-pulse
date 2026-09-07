import { actionRepository } from "../repositories/action";
import { memberRepository } from "../repositories/member";
import { ActionItem } from "../types/action";

export const actionService = {
  getActions: (): ActionItem[] => {
    return actionRepository.getActions();
  },
  getAction: (id: string): ActionItem | undefined => {
    return actionRepository.getAction(id);
  },
  createAction: (actionItem: ActionItem): string => {
    if (!memberRepository.getMember(actionItem.ownerId)) {
      throw new Error("There is no member with the given ownerId!");
    }
    const id = crypto.randomUUID();
    actionRepository.createAction({ ...actionItem, id });
    return id;
  },
  editAction: (id: string, newActionItem: ActionItem): number => {
    if (!memberRepository.getMember(newActionItem.ownerId)) {
      throw new Error("There is no member with the given ownerId!");
    }

    return actionRepository.editAction(id, newActionItem);
  },
};
