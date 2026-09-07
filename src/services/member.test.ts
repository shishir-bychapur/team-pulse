import { memberService } from "./member";
import { memberRepository } from "../repositories/member";

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

  describe("Get Members", () => {
    it("should return all members", () => {
      const mockMembers = [
        {
          id: "member-1",
          name: "Tom",
          timezone: "Asia/Singapore",
          role: {
            id: "role-1",
            name: "Developer",
          },
        },
        {
          id: "member-2",
          name: "Harry",
          timezone: "Europe/London",
          role: {
            id: "role-2",
            name: "Designer",
          },
        },
      ];

      mockedMemberRepository.getMembers.mockReturnValue(mockMembers);

      const result = memberService.getMembers();

      expect(result).toEqual(mockMembers);

      expect(mockedMemberRepository.getMembers).toHaveBeenCalledTimes(1);
    });
  });

  describe("Get Member", () => {
    it("should return the correct member when the id exists", () => {
      const mockMember = {
        id: "member-1",
        name: "Tom",
        timezone: "Asia/Singapore",
        role: {
          id: "role-1",
          name: "Developer",
        },
      };

      mockedMemberRepository.getMember.mockReturnValue(mockMember);

      const result = memberService.getMember("member-1");

      expect(result).toEqual(mockMember);

      expect(mockedMemberRepository.getMember).toHaveBeenCalledWith("member-1");

      expect(mockedMemberRepository.getMember).toHaveBeenCalledTimes(1);
    });

    it("should return undefined when the member does not exist", () => {
      mockedMemberRepository.getMember.mockReturnValue(undefined);

      const result = memberService.getMember("invalid-id");

      expect(result).toBeUndefined();

      expect(mockedMemberRepository.getMember).toHaveBeenCalledWith(
        "invalid-id",
      );
    });
  });
});
