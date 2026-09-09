import { authRepository } from "../repositories/auth";
import { createSession, deleteSession } from "../utils/session";

export const authService = {
  login: async (username: string, password: string): Promise<void> => {
    const member = await authRepository.login(username, password);
    await createSession(member.id, member.name);
  },
  logout: async (): Promise<void> => {
    await deleteSession();
  },
};
