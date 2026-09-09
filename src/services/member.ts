import { memberRepository } from "../repositories/member";
import { MemberWithRole } from "../types/member";

export const memberService = {
  getMembers: (): Promise<MemberWithRole[]> => {
    return memberRepository.getMembers();
  },
  getMember: (id: string): Promise<MemberWithRole | null> => {
    return memberRepository.getMember(id);
  },
};
