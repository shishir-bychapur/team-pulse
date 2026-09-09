import { prisma } from "@/prisma/prisma";
import { MemberWithRole } from "../types/member";

export const memberRepository = {
  getMembers: async (): Promise<MemberWithRole[]> => {
    return await prisma.member.findMany({
      include: {
        role: true,
      },
    });
  },
  getMember: async (id: string): Promise<MemberWithRole | null> => {
    return await prisma.member.findFirst({
      where: {
        id,
      },
      include: {
        role: true,
      },
    });
  },
};
