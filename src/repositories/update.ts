import { prisma } from "@/prisma/prisma";
import { Mood } from "@/generated/prisma/enums";
import { Update } from "@/generated/prisma/client";

export const updateRepository = {
  getUpdates: async (
    filteredMembers: string[],
    filteredMoods: Mood[],
    filteredDate: string | null,
  ): Promise<Update[]> => {
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
    });
  },
  createUpdate: async (update: Update): Promise<void> => {
    await prisma.update.create({
      data: update,
    });
  },
};
