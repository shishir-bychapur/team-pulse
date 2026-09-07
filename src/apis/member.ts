import { Member } from "../types/member";
import { getBaseUrl } from "../utils/base-url";

export const memberAPI = {
  async getSingleMember(id: string): Promise<{ member: Member | null }> {
    const response = await fetch(getBaseUrl() + `/api/members/${id}`);
    return await response.json();
  },

  async getAllMembers(): Promise<{ members: Member[] }> {
    const response = await fetch(getBaseUrl() + `/api/members`);
    return await response.json();
  },
};
