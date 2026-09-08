import { authService } from "./auth";
import { authRepository } from "../repositories/auth";
import { createSession, deleteSession } from "../utils/session";

jest.mock("../repositories/auth", () => ({
  authRepository: {
    login: jest.fn(),
  },
}));

jest.mock("../utils/session", () => ({
  createSession: jest.fn(),
  deleteSession: jest.fn(),
}));

describe("authService", () => {
  const mockedLogin = authRepository.login as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should create a session when login is successful", async () => {
      mockedLogin.mockReturnValue(true);

      await authService.login("test@example.com", "password123");

      expect(authRepository.login).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );

      expect(createSession).toHaveBeenCalledWith("test@example.com");
    });

    it("should not create a session when login fails", async () => {
      mockedLogin.mockReturnValue(false);

      await authService.login("test@example.com", "wrongpassword");

      expect(authRepository.login).toHaveBeenCalledWith(
        "test@example.com",
        "wrongpassword",
      );

      expect(createSession).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should delete the session", async () => {
      await authService.logout();

      expect(deleteSession).toHaveBeenCalledTimes(1);
    });
  });
});
