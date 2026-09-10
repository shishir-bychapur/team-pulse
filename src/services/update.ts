import { unstable_cache, revalidateTag } from "next/cache";
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
    return updateRepository.getUpdates(
      filteredMembers,
      filteredMoods.map((mood) => mood as Mood),
      date,
    );
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
