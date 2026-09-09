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

const mockedAuthRepository = authRepository as jest.Mocked<
  typeof authRepository
>;

const mockedCreateSession = createSession as jest.MockedFunction<
  typeof createSession
>;

const mockedDeleteSession = deleteSession as jest.MockedFunction<
  typeof deleteSession
>;

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Login", () => {
    it("should create a session when login is successful", async () => {
      const mockMember = {
        id: "member-1",
        name: "Test User",
        email: "test@example.com",
        roleId: "role-1",
        timezone: "UTC",
      };

      mockedAuthRepository.login.mockResolvedValue(mockMember);

      await authService.login("test@example.com", "password123");

      expect(mockedAuthRepository.login).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );

      expect(mockedAuthRepository.login).toHaveBeenCalledTimes(1);

      expect(mockedCreateSession).toHaveBeenCalledWith("member-1", "Test User");

      expect(mockedCreateSession).toHaveBeenCalledTimes(1);
    });

    it("should not create a session when login fails", async () => {
      mockedAuthRepository.login.mockRejectedValue(
        new Error("Member not found"),
      );

      await expect(
        authService.login("wrong@example.com", "wrongpassword"),
      ).rejects.toThrow("Member not found");

      expect(mockedAuthRepository.login).toHaveBeenCalledWith(
        "wrong@example.com",
        "wrongpassword",
      );

      expect(mockedCreateSession).not.toHaveBeenCalled();
    });

    it("should pass the member ID and name to createSession", async () => {
      const mockMember = {
        id: "member-123",
        name: "John Doe",
        email: "john@example.com",
        roleId: "role-1",
        timezone: "Asia/Singapore",
      };

      mockedAuthRepository.login.mockResolvedValue(mockMember);

      await authService.login("john@example.com", "password123");

      expect(mockedCreateSession).toHaveBeenCalledWith(
        "member-123",
        "John Doe",
      );
    });

    it("should throw an error if creating the session fails", async () => {
      const mockMember = {
        id: "member-1",
        name: "Test User",
        email: "test@example.com",
        roleId: "role-1",
        timezone: "UTC",
      };

      mockedAuthRepository.login.mockResolvedValue(mockMember);

      mockedCreateSession.mockRejectedValue(
        new Error("Failed to create session"),
      );

      await expect(
        authService.login("test@example.com", "password123"),
      ).rejects.toThrow("Failed to create session");

      expect(mockedAuthRepository.login).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );

      expect(mockedCreateSession).toHaveBeenCalledWith("member-1", "Test User");
    });
  });

  describe("Logout", () => {
    it("should delete the session successfully", async () => {
      mockedDeleteSession.mockResolvedValue();

      await authService.logout();

      expect(mockedDeleteSession).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when deleting the session fails", async () => {
      mockedDeleteSession.mockRejectedValue(
        new Error("Failed to delete session"),
      );

      await expect(authService.logout()).rejects.toThrow(
        "Failed to delete session",
      );

      expect(mockedDeleteSession).toHaveBeenCalledTimes(1);
    });
  });
});
