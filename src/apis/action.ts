import { ActionForm } from "../schema/action";
import { ActionItem } from "../types/action";
import { getBaseUrl } from "../utils/base-url";

export const actionAPI = {
  async getSingleAction(id: string): Promise<{ action: ActionItem | null }> {
    const response = await fetch(getBaseUrl() + `/api/actions/${id}`);
    return await response.json();
  },

  async getAllActions(): Promise<{ actions: ActionItem[] }> {
    const response = await fetch(getBaseUrl() + `/api/actions`);
    return await response.json();
  },

  async createAction(data: ActionForm): Promise<Response> {
    const response = await fetch(getBaseUrl() + "/api/actions", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  },
  async editAction(id: string, data: ActionForm): Promise<Response> {
    const response = await fetch(getBaseUrl() + `/api/actions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return response;
  },
};
