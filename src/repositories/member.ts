import { members } from "../data/member";
import { Member } from "../types/member";

export const memberRepository = {
  getMembers: (): Member[] => {
    return members;
  },
  getMember: (id: string): Member | undefined => {
    return members.find((member) => member.id === id);
  },
};
