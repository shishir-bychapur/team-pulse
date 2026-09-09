import { prisma } from "@/prisma/prisma";
import { memberRepository } from "./member";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    member: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

const mockMembers = [
  {
    id: "1",
    name: "Tom",
    email: "tom@example.com",
    timezone: "America/New_York",
    roleId: "r1",
    role: {
      id: "r1",
      name: "Developer",
    },
  },
  {
    id: "2",
    name: "Harry",
    email: "harry@example.com",
    timezone: "Europe/London",
    roleId: "r2",
    role: {
      id: "r2",
      name: "Designer",
    },
  },
];

describe("Member Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Get All Members", () => {
    it("should return all members correctly", async () => {
      jest.mocked(prisma.member.findMany).mockResolvedValue(mockMembers);

      const data = await memberRepository.getMembers();

      expect(data).toHaveLength(2);
      expect(data).toEqual(mockMembers);

      expect(prisma.member.findMany).toHaveBeenCalledWith({
        include: {
          role: true,
        },
      });
    });
  });

  describe("Get Member", () => {
    it("should return the member when the member exists", async () => {
      const mockMember = mockMembers[0];

      jest.mocked(prisma.member.findFirst).mockResolvedValue(mockMember);

      const data = await memberRepository.getMember("1");

      expect(data).toEqual(mockMember);
      expect(data?.id).toBe("1");
      expect(data?.name).toBe("Tom");

      expect(prisma.member.findFirst).toHaveBeenCalledWith({
        where: {
          id: "1",
        },
        include: {
          role: true,
        },
      });
    });

    it("should return null when the member does not exist", async () => {
      jest.mocked(prisma.member.findFirst).mockResolvedValue(null);

      const data = await memberRepository.getMember("3");

      expect(data).toBeNull();

      expect(prisma.member.findFirst).toHaveBeenCalledWith({
        where: {
          id: "3",
        },
        include: {
          role: true,
        },
      });
    });
  });
});
