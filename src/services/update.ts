import { unstable_cache, revalidateTag } from "next/cache";
import { memberRepository } from "../repositories/member";
import { updateRepository } from "../repositories/update";
import { Mood } from "@/generated/prisma/enums";
import { Update } from "@/generated/prisma/client";
import { MoodBreakdownResult, UpdateWithMember } from "../types/update";

const getCachedUpdates = unstable_cache(
  async (
    filteredMembers: string[],
    filteredMoods: string[],
    date: string | null,
  ): Promise<UpdateWithMember[]> => {
    const members = await memberRepository.getMembers();
    const moods = [Mood.RED, Mood.YELLOW, Mood.GREEN];

    const memberIds = filteredMembers.length
      ? filteredMembers
      : members.map((member) => member.id);

    const selectedMoods = filteredMoods.length
      ? filteredMoods.map((mood) => mood as Mood)
      : moods;

    return updateRepository.getUpdates(memberIds, selectedMoods, date);
  },
  ["updates"],
  {
    revalidate: 86400, // 1 day
    tags: ["updates"],
  },
);

export const updateService = {
  getUpdates: (
    filteredMembers: string[],
    filteredMoods: string[],
    date: string | null,
  ): Promise<UpdateWithMember[]> => {
    return getCachedUpdates(filteredMembers, filteredMoods, date);
  },

  getMoodBreakdown: async (): Promise<MoodBreakdownResult[]> => {
    return await updateRepository.getMoodBreakdown();
  },

  createUpdate: async (update: Update): Promise<void> => {
    await updateRepository.createUpdate({
      ...update,
      id: crypto.randomUUID(),
    });

    revalidateTag("updates", "max");
  },
};
