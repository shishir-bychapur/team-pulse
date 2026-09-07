import { updates } from "../data/update";
import { Update } from "../types/update";

export const updateRepository = {
  getUpdates: (
    filteredMembers: string[],
    filteredMoods: string[],
    filteredDate: string | null,
  ): Update[] => {
    return updates.filter(
      (update) =>
        filteredMembers.includes(update.memberId) &&
        filteredMoods.includes(update.mood) &&
        (!filteredDate || update.date === filteredDate),
    );
  },
  createUpdate: (update: Update): void => {
    updates.push(update);
  },
};
