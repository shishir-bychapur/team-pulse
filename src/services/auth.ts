import { authRepository } from "../repositories/auth";
import { createSession } from "../utils/session";

export const authService = {
  login: async (username: string, password: string): Promise<void> => {
    if (authRepository.login(username, password)) {
      await createSession(username);
    }
  },
};
