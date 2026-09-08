import { authRepository } from "./auth";

describe("authRepository", () => {
  describe("login", () => {
    it("should return true for valid mock login", () => {
      const result = authRepository.login("test@example.com", "password123");

      expect(result).toBe(true);
    });

    it("should return true regardless of the provided credentials", () => {
      const result = authRepository.login("wrong@example.com", "wrongpassword");

      expect(result).toBe(true);
    });
  });
});
