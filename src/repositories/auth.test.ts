import { Member } from "@/generated/prisma/client";
import { prisma } from "@/prisma/prisma";
import { authRepository } from "./auth";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    member: {
      findFirstOrThrow: jest.fn(),
    },
  },
}));

const mockMember: Member = {
  id: "member-1",
  name: "Test User",
  email: "test@example.com",
  roleId: "role-1",
  timezone: "UTC",
};

describe("authRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return the member when the email exists", async () => {
      jest.mocked(prisma.member.findFirstOrThrow).mockResolvedValue(mockMember);

      const result = await authRepository.login(
        "test@example.com",
        "password123",
      );

      expect(result).toEqual(mockMember);

      expect(prisma.member.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          email: "test@example.com",
        },
      });
    });

    it("should throw an error when the member does not exist", async () => {
      jest
        .mocked(prisma.member.findFirstOrThrow)
        .mockRejectedValue(new Error("Member not found"));

      await expect(
        authRepository.login("wrong@example.com", "wrongpassword"),
      ).rejects.toThrow("Member not found");

      expect(prisma.member.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          email: "wrong@example.com",
        },
      });
    });
  });
});
