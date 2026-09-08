import { MemberWithRole } from "@/src/types/member";
import { getBaseUrl } from "../base-url";

export const memberAPI = {
  async getSingleMember(
    id: string,
  ): Promise<{ member: MemberWithRole | null }> {
    const response = await fetch(getBaseUrl() + `/api/members/${id}`);
    return await response.json();
  },

  async getAllMembers(): Promise<{ members: MemberWithRole[] }> {
    const response = await fetch(getBaseUrl() + `/api/members`);
    return await response.json();
  },
};
