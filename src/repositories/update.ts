import { prisma } from "@/prisma/prisma";
import { Mood } from "@/generated/prisma/enums";
import { Update } from "@/generated/prisma/client";
import { MoodBreakdownResult, UpdateWithMember } from "../types/update";

export const updateRepository = {
  getUpdates: async (
    filteredMembers: string[],
    filteredMoods: Mood[],
    filteredDate: string | null,
  ): Promise<UpdateWithMember[]> => {
    return await prisma.update.findMany({
      where: {
        memberId: {
          in: filteredMembers,
        },
        mood: {
          in: filteredMoods,
        },
        ...(filteredDate && {
          date: filteredDate,
        }),
      },
      include: {
        member: true,
      },
    });
  },
  createUpdate: async (update: Update): Promise<void> => {
    await prisma.update.create({
      data: update,
    });
  },
  getMoodBreakdown: async (): Promise<MoodBreakdownResult[]> => {
    const result = await prisma.update.groupBy({
      by: ["mood"],
      _count: {
        mood: true,
      },
    });

    return result;
  },
};
