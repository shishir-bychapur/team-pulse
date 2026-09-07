import { getBaseUrl } from "../base-url";

export const authAPI = {
  async login(username: string, password: string): Promise<void> {
    const response = await fetch(getBaseUrl() + `/api/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });
    return await response.json();
  },
};
