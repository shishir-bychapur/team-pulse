import { ActionForm } from "@/src/schema/action";
import { ActionItemWithOwner } from "@/src/types/action";
import { ActionStatus } from "@/generated/prisma/enums";
import { getBaseUrl } from "../base-url";

export const actionAPI = {
  async getSingleAction(
    id: string,
  ): Promise<{ action: ActionItemWithOwner | null }> {
    const response = await fetch(getBaseUrl() + `/api/actions/${id}`);
    return await response.json();
  },

  async getAllActions(): Promise<{ actions: ActionItemWithOwner[] }> {
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
