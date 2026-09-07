import { UpdateForm } from "../schema/update";
import { Update } from "../types/update";
import { getBaseUrl } from "../utils/base-url";

export const updateAPI = {
  async createUpdate(data: UpdateForm): Promise<Response> {
    const response = await fetch(getBaseUrl() + `/api/updates`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  },

  async getUpdates(params: string): Promise<{ updates: Update[] }> {
    const response = await fetch(getBaseUrl() + `/api/updates?` + params);
    return await response.json();
  },
};
