import { updateService } from "./update";
import { updateRepository } from "../repositories/update";
import { Update } from "@/generated/prisma/client";
import { Mood } from "@/generated/prisma/enums";
import { UpdateWithMember } from "../types/update";
import { revalidateTag } from "next/cache";

jest.mock("next/cache", () => ({
  unstable_cache: <T extends (...args: unknown[]) => unknown>(fn: T): T => fn,
  revalidateTag: jest.fn(),
}));

jest.mock("../repositories/update", () => ({
  updateRepository: {
    getUpdates: jest.fn(),
    getMoodBreakdown: jest.fn(),
    createUpdate: jest.fn(),
  },
}));

const mockedUpdateRepository = updateRepository as jest.Mocked<
  typeof updateRepository
>;

const mockedRevalidateTag = revalidateTag as jest.MockedFunction<
  typeof revalidateTag
>;

describe("Update Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUpdates: UpdateWithMember[] = [
    {
      id: "update-1",
      memberId: "member-1",
      mood: Mood.GREEN,
      date: "2026-09-01",
      text: "Update 1",
      member: {
        id: "member-1",
        name: "Tom",
        email: "tom@example.com",
        timezone: "Asia/Singapore",
        roleId: "role-1",
      },
    },
  ];

  describe("Get Updates", () => {
    it("should get updates using the provided filters", async () => {
      mockedUpdateRepository.getUpdates.mockResolvedValue(mockUpdates);

      const result = await updateService.getUpdates(
        ["member-1"],
        [Mood.GREEN],
        "2026-09-01",
      );

      expect(result).toEqual(mockUpdates);

      expect(mockedUpdateRepository.getUpdates).toHaveBeenCalledWith(
        ["member-1"],
        [Mood.GREEN],
        "2026-09-01",
      );
    });

    it("should use all members when no member filters are provided", async () => {
      mockedUpdateRepository.getUpdates.mockResolvedValue([]);

      const result = await updateService.getUpdates([], [Mood.GREEN], null);

      expect(result).toEqual([]);

      expect(mockedUpdateRepository.getUpdates).toHaveBeenCalledWith(
        [],
        [Mood.GREEN],
        null,
      );
    });

    it("should use all moods when no mood filters are provided", async () => {
      mockedUpdateRepository.getUpdates.mockResolvedValue([]);

      await updateService.getUpdates(["member-1"], [], null);

      expect(mockedUpdateRepository.getUpdates).toHaveBeenCalledWith(
        ["member-1"],
        [],
        null,
      );
    });

    it("should use all members and all moods when no filters are provided", async () => {
      mockedUpdateRepository.getUpdates.mockResolvedValue(mockUpdates);

      const result = await updateService.getUpdates([], [], null);

      expect(result).toEqual(mockUpdates);

      expect(mockedUpdateRepository.getUpdates).toHaveBeenCalledWith(
        [],
        [],
        null,
      );
    });

    it("should pass null when no date is provided", async () => {
      mockedUpdateRepository.getUpdates.mockResolvedValue([]);

      await updateService.getUpdates(["member-1"], [Mood.GREEN], null);

      expect(mockedUpdateRepository.getUpdates).toHaveBeenCalledWith(
        ["member-1"],
        [Mood.GREEN],
        null,
      );
    });

    it("should convert mood strings to Mood enum values", async () => {
      mockedUpdateRepository.getUpdates.mockResolvedValue([]);

      await updateService.getUpdates(["member-1"], ["RED", "GREEN"], null);

      expect(mockedUpdateRepository.getUpdates).toHaveBeenCalledWith(
        ["member-1"],
        [Mood.RED, Mood.GREEN],
        null,
      );
    });

    it("should return an empty array when no updates are found", async () => {
      mockedUpdateRepository.getUpdates.mockResolvedValue([]);

      const result = await updateService.getUpdates(
        ["member-1"],
        [Mood.GREEN],
        null,
      );

      expect(result).toEqual([]);
    });

    it("should throw an error when getting updates fails", async () => {
      mockedUpdateRepository.getUpdates.mockRejectedValue(
        new Error("Failed to get updates"),
      );

      await expect(
        updateService.getUpdates(["member-1"], [Mood.GREEN], null),
      ).rejects.toThrow("Failed to get updates");
    });
  });

  describe("Get Mood Breakdown", () => {
    it("should return the mood breakdown", async () => {
      const mockMoodBreakdown = [
        {
          mood: Mood.GREEN,
          _count: {
            mood: 3,
          },
        },
        {
          mood: Mood.YELLOW,
          _count: {
            mood: 2,
          },
        },
        {
          mood: Mood.RED,
          _count: {
            mood: 1,
          },
        },
      ];

      mockedUpdateRepository.getMoodBreakdown.mockResolvedValue(
        mockMoodBreakdown,
      );

      const result = await updateService.getMoodBreakdown();

      expect(result).toEqual(mockMoodBreakdown);

      expect(mockedUpdateRepository.getMoodBreakdown).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array when there are no mood updates", async () => {
      mockedUpdateRepository.getMoodBreakdown.mockResolvedValue([]);

      const result = await updateService.getMoodBreakdown();

      expect(result).toEqual([]);
    });

    it("should throw an error when getting the mood breakdown fails", async () => {
      mockedUpdateRepository.getMoodBreakdown.mockRejectedValue(
        new Error("Database error"),
      );

      await expect(updateService.getMoodBreakdown()).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("Create Update", () => {
    it("should generate an ID, create an update, and revalidate the cache", async () => {
      const mockUpdate: Update = {
        id: "old-id",
        memberId: "member-1",
        mood: Mood.GREEN,
        date: "2026-09-01",
        text: "Worked on the update service.",
      };

      const mockUUID = "generated-update-id";

      jest.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID);

      mockedUpdateRepository.createUpdate.mockResolvedValue();

      await updateService.createUpdate(mockUpdate);

      expect(mockedUpdateRepository.createUpdate).toHaveBeenCalledWith({
        ...mockUpdate,
        id: mockUUID,
      });

      expect(mockedUpdateRepository.createUpdate).toHaveBeenCalledTimes(1);

      expect(mockedRevalidateTag).toHaveBeenCalledWith("updates", "max");
      expect(mockedRevalidateTag).toHaveBeenCalledTimes(1);
    });

    it("should replace the existing ID with a newly generated UUID", async () => {
      const mockUpdate: Update = {
        id: "existing-id",
        memberId: "member-1",
        mood: Mood.RED,
        date: "2026-09-02",
        text: "Another update.",
      };

      const mockUUID = "new-generated-update-id";

      jest.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID);

      mockedUpdateRepository.createUpdate.mockResolvedValue();

      await updateService.createUpdate(mockUpdate);

      expect(mockedUpdateRepository.createUpdate).toHaveBeenCalledWith({
        ...mockUpdate,
        id: mockUUID,
      });

      expect(mockedRevalidateTag).toHaveBeenCalledWith("updates", "max");
    });

    it("should not revalidate the cache when creating the update fails", async () => {
      const mockUpdate: Update = {
        id: "",
        memberId: "member-1",
        mood: Mood.GREEN,
        date: "2026-09-01",
        text: "This update should fail.",
      };

      jest.spyOn(crypto, "randomUUID").mockReturnValue("generated-update-id");

      mockedUpdateRepository.createUpdate.mockRejectedValue(
        new Error("Failed to create update"),
      );

      await expect(updateService.createUpdate(mockUpdate)).rejects.toThrow(
        "Failed to create update",
      );

      expect(mockedRevalidateTag).not.toHaveBeenCalled();
    });
  });
});
