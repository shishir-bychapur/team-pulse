import { UpdateForm } from "@/src/schema/update";
import { getBaseUrl } from "../base-url";
import { UpdateWithMember } from "@/src/types/update";

export const updateAPI = {
  async createUpdate(data: UpdateForm): Promise<Response> {
    const response = await fetch(getBaseUrl() + `/api/updates`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  },

  async getUpdates(params: string): Promise<{ updates: UpdateWithMember[] }> {
    const response = await fetch(getBaseUrl() + `/api/updates?` + params);
    return await response.json();
  },
};
