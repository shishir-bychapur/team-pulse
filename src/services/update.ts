import { memberRepository } from "../repositories/member";
import { updateRepository } from "../repositories/update";
import { Mood, Update } from "../types/update";

export const updateService = {
  getUpdates: (url: URL): Update[] => {
    let filteredMembers = url.searchParams.getAll("members");
    let filteredMoods = url.searchParams.getAll("moods");
    const date = url.searchParams.get("date");

    const members = memberRepository.getMembers();
    const moods = [Mood.RED, Mood.YELLOW, Mood.GREEN];

    if (!filteredMembers.length) {
      filteredMembers = members.map((member) => member.id);
    }

    if (!filteredMoods.length) {
      filteredMoods = moods;
    }

    return updateRepository.getUpdates(filteredMembers, filteredMoods, date);
  },
  createUpdate: (update: Update): void => {
    if (!memberRepository.getMember(update.memberId)) {
      throw new Error("There is no member with the given memberId!");
    }
    updateRepository.createUpdate({ ...update, id: crypto.randomUUID() });
  },
};
