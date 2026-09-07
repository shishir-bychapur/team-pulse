import { memberRepository } from "../repositories/member";
import { Member } from "../types/member";

export const memberService = {
  getMembers: (): Member[] => {
    return memberRepository.getMembers();
  },
  getMember: (id: string): Member | undefined => {
    return memberRepository.getMember(id);
  },
};
