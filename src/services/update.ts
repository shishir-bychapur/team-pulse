import { memberRepository } from "../repositories/member";
import { updateRepository } from "../repositories/update";
import { Mood } from "@/generated/prisma/enums";
import { Update } from "@/generated/prisma/client";

export const updateService = {
  getUpdates: async (url: URL): Promise<Update[]> => {
    let filteredMembers = url.searchParams.getAll("members");
    let filteredMoods = url.searchParams.getAll("moods");
    const date = url.searchParams.get("date");

    const members = await memberRepository.getMembers();
    const moods = [Mood.RED, Mood.YELLOW, Mood.GREEN];

    if (!filteredMembers.length) {
      filteredMembers = members.map((member) => member.id);
    }

    if (!filteredMoods.length) {
      filteredMoods = moods;
    }

    return await updateRepository.getUpdates(
      filteredMembers,
      filteredMoods.map((mood) => mood as Mood),
      date,
    );
  },
  createUpdate: async (update: Update): Promise<void> => {
    await updateRepository.createUpdate({ ...update, id: crypto.randomUUID() });
  },
};
