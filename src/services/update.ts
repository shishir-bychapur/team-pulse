import { memberRepository } from "../repositories/member";
import { updateRepository } from "../repositories/update";
import { Mood } from "@/generated/prisma/enums";
import { Update } from "@/generated/prisma/client";
import { MoodBreakdownResult, UpdateWithMember } from "../types/update";

export const updateService = {
  getUpdates: async (
    filteredMembers: string[],
    filteredMoods: string[],
    date: string | null,
  ): Promise<UpdateWithMember[]> => {
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
  getMoodBreakdown: async (): Promise<MoodBreakdownResult[]> => {
    return await updateRepository.getMoodBreakdown();
  },
  createUpdate: async (update: Update): Promise<void> => {
    await updateRepository.createUpdate({ ...update, id: crypto.randomUUID() });
  },
};
