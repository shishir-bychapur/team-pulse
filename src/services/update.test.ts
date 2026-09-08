import { updateService } from "./update";
import { memberRepository } from "../repositories/member";
import { updateRepository } from "../repositories/update";
import { Update } from "../types/update";
import { Mood } from "@/generated/prisma/enums";

jest.mock("../repositories/member", () => ({
  memberRepository: {
    getMembers: jest.fn(),
    getMember: jest.fn(),
  },
}));

jest.mock("../repositories/update", () => ({
  updateRepository: {
    getUpdates: jest.fn(),
    createUpdate: jest.fn(),
  },
}));

const mockedMemberRepository = memberRepository as jest.Mocked<
  typeof memberRepository
>;

const mockedUpdateRepository = updateRepository as jest.Mocked<
  typeof updateRepository
>;

describe("Update Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  describe("Get Updates", () => {
    it("should get updates using the filters from the URL", () => {
      const mockUpdates: Update[] = [
        {
          id: "update-1",
          memberId: "member-1",
          mood: Mood.GREEN,
          date: "2026-09-01",
          text: "Update 1",
        },
      ];

      const url = new URL(
        "http://localhost:3000/updates?members=member-1&moods=GREEN&date=2026-09-01",
      );

      mockedMemberRepository.getMembers.mockReturnValue(mockMembers);
      mockedUpdateRepository.getUpdates.mockReturnValue(mockUpdates);

      const result = updateService.getUpdates(url);

      expect(mockedUpdateRepository.getUpdates).toHaveBeenCalledWith(
        ["member-1"],
        ["GREEN"],
        "2026-09-01",
      );

      expect(result).toEqual(mockUpdates);
    });

    it("should use all members when no member filter is provided", () => {
      const url = new URL("http://localhost:3000/updates?moods=GREEN");

      mockedMemberRepository.getMembers.mockReturnValue(mockMembers);
      mockedUpdateRepository.getUpdates.mockReturnValue([]);

      updateService.getUpdates(url);

      expect(mockedUpdateRepository.getUpdates).toHaveBeenCalledWith(
        ["member-1", "member-2"],
        ["GREEN"],
        null,
      );
    });

    it("should use all moods when no mood filter is provided", () => {
      const url = new URL("http://localhost:3000/updates?members=member-1");

      mockedMemberRepository.getMembers.mockReturnValue(mockMembers);
      mockedUpdateRepository.getUpdates.mockReturnValue([]);

      updateService.getUpdates(url);

      expect(mockedUpdateRepository.getUpdates).toHaveBeenCalledWith(
        ["member-1"],
        [Mood.RED, Mood.YELLOW, Mood.GREEN],
        null,
      );
    });

    it("should use all members and all moods when no filters are provided", () => {
      const url = new URL("http://localhost:3000/updates");

      mockedMemberRepository.getMembers.mockReturnValue(mockMembers);
      mockedUpdateRepository.getUpdates.mockReturnValue([]);

      updateService.getUpdates(url);

      expect(mockedUpdateRepository.getUpdates).toHaveBeenCalledWith(
        ["member-1", "member-2"],
        [Mood.RED, Mood.YELLOW, Mood.GREEN],
        null,
      );
    });

    it("should pass null when no date is provided", () => {
      const url = new URL(
        "http://localhost:3000/updates?members=member-1&moods=GREEN",
      );

      mockedMemberRepository.getMembers.mockReturnValue(mockMembers);
      mockedUpdateRepository.getUpdates.mockReturnValue([]);

      updateService.getUpdates(url);

      expect(mockedUpdateRepository.getUpdates).toHaveBeenCalledWith(
        ["member-1"],
        ["GREEN"],
        null,
      );
    });
  });

  describe("Create Update", () => {
    it("should create an update successfully when the member exists", () => {
      const mockUpdate: Update = {
        id: "",
        memberId: "member-1",
        mood: Mood.GREEN,
        date: "2026-09-01",
        text: "Worked on the update service.",
      };

      const mockUUID = "generated-update-id";

      mockedMemberRepository.getMember.mockReturnValue(mockMembers[0]);

      jest.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID);

      updateService.createUpdate(mockUpdate);

      expect(mockedMemberRepository.getMember).toHaveBeenCalledWith("member-1");

      expect(mockedUpdateRepository.createUpdate).toHaveBeenCalledWith({
        ...mockUpdate,
        id: mockUUID,
      });
    });

    it("should throw an error when the member does not exist", () => {
      const mockUpdate: Update = {
        id: "",
        memberId: "invalid-member",
        mood: Mood.RED,
        date: "2026-09-01",
        text: "This should fail.",
      };

      mockedMemberRepository.getMember.mockReturnValue(undefined);

      expect(() => {
        updateService.createUpdate(mockUpdate);
      }).toThrow("There is no member with the given memberId!");

      expect(mockedUpdateRepository.createUpdate).not.toHaveBeenCalled();
    });
  });
});
