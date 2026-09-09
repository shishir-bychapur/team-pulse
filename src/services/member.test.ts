import { memberService } from "./member";
import { memberRepository } from "../repositories/member";
import { MemberWithRole } from "../types/member";

jest.mock("../repositories/member", () => ({
  memberRepository: {
    getMembers: jest.fn(),
    getMember: jest.fn(),
  },
}));

const mockedMemberRepository = memberRepository as jest.Mocked<
  typeof memberRepository
>;

describe("Member Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMembers: MemberWithRole[] = [
    {
      id: "member-1",
      name: "Tom",
      email: "tom@example.com",
      timezone: "Asia/Singapore",
      roleId: "role-1",
      role: {
        id: "role-1",
        name: "Developer",
      },
    },
    {
      id: "member-2",
      name: "Harry",
      email: "harry@example.com",
      timezone: "Europe/London",
      roleId: "role-2",
      role: {
        id: "role-2",
        name: "Designer",
      },
    },
  ];

  describe("Get Members", () => {
    it("should return all members", async () => {
      mockedMemberRepository.getMembers.mockResolvedValue(mockMembers);

      const result = await memberService.getMembers();

      expect(result).toEqual(mockMembers);
      expect(result).toHaveLength(2);

      expect(mockedMemberRepository.getMembers).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array when there are no members", async () => {
      mockedMemberRepository.getMembers.mockResolvedValue([]);

      const result = await memberService.getMembers();

      expect(result).toEqual([]);

      expect(mockedMemberRepository.getMembers).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when the repository fails", async () => {
      mockedMemberRepository.getMembers.mockRejectedValue(
        new Error("Database error"),
      );

      await expect(memberService.getMembers()).rejects.toThrow(
        "Database error",
      );

      expect(mockedMemberRepository.getMembers).toHaveBeenCalledTimes(1);
    });
  });

  describe("Get Member", () => {
    it("should return the correct member when the id exists", async () => {
      const mockMember = mockMembers[0];

      mockedMemberRepository.getMember.mockResolvedValue(mockMember);

      const result = await memberService.getMember("member-1");

      expect(result).toEqual(mockMember);

      expect(mockedMemberRepository.getMember).toHaveBeenCalledWith("member-1");

      expect(mockedMemberRepository.getMember).toHaveBeenCalledTimes(1);
    });

    it("should return null when the member does not exist", async () => {
      mockedMemberRepository.getMember.mockResolvedValue(null);

      const result = await memberService.getMember("invalid-id");

      expect(result).toBeNull();

      expect(mockedMemberRepository.getMember).toHaveBeenCalledWith(
        "invalid-id",
      );

      expect(mockedMemberRepository.getMember).toHaveBeenCalledTimes(1);
    });

    it("should pass the provided member ID to the repository", async () => {
      mockedMemberRepository.getMember.mockResolvedValue(mockMembers[1]);

      const result = await memberService.getMember("member-2");

      expect(result).toEqual(mockMembers[1]);

      expect(mockedMemberRepository.getMember).toHaveBeenCalledWith("member-2");
    });

    it("should throw an error when the repository fails", async () => {
      mockedMemberRepository.getMember.mockRejectedValue(
        new Error("Database error"),
      );

      await expect(memberService.getMember("member-1")).rejects.toThrow(
        "Database error",
      );

      expect(mockedMemberRepository.getMember).toHaveBeenCalledWith("member-1");
    });
  });
});
