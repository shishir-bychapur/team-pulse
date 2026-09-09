import { unstable_cache } from "next/cache";
import { memberRepository } from "../repositories/member";
import { MemberWithRole } from "../types/member";

const getCachedMembers = unstable_cache(
  (): Promise<MemberWithRole[]> => memberRepository.getMembers(),
  ["members"],
  {
    revalidate: 86400, // 1 day
  },
);

const getCachedMember = unstable_cache(
  (id: string): Promise<MemberWithRole | null> =>
    memberRepository.getMember(id),
  ["member"],
  {
    revalidate: 86400, // 1 day
  },
);

export const memberService = {
  getMembers: (): Promise<MemberWithRole[]> => {
    return getCachedMembers();
  },

  getMember: (id: string): Promise<MemberWithRole | null> => {
    return getCachedMember(id);
  },
};
