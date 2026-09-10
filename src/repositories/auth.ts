/* eslint-disable @typescript-eslint/no-unused-vars */
import { Member } from "@/generated/prisma/client";
import { prisma } from "@/prisma/prisma";

export const authRepository = {
  login: async (username: string, password: string): Promise<Member> => {
    return await prisma.member.findFirstOrThrow({
      where: {
        email: username,
      },
    });
  },
};
