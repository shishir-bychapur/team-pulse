import { Mood } from "@/generated/prisma/enums";
import { prisma } from "@/prisma/prisma";
import { updateRepository } from "./update";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    update: {
      findMany: jest.fn(),
      create: jest.fn(),
      groupBy: jest.fn(),
    },
  },
}));

const mockUpdates = [
  {
    id: "1",
    memberId: "member-1",
    mood: Mood.GREEN,
    date: "2026-09-01",
    text: "Update 1",
    member: {
      id: "member-1",
      name: "Tom",
      email: "tom@example.com",
      roleId: "role-1",
      timezone: "UTC",
    },
  },
  {
    id: "2",
    memberId: "member-1",
    mood: Mood.YELLOW,
    date: "2026-09-02",
    text: "Update 2",
    member: {
      id: "member-1",
      name: "Tom",
      email: "tom@example.com",
      roleId: "role-1",
      timezone: "UTC",
    },
  },
  {
    id: "3",
    memberId: "member-2",
    mood: Mood.RED,
    date: "2026-09-01",
    text: "Update 3",
    member: {
      id: "member-2",
      name: "Harry",
      email: "harry@example.com",
      roleId: "role-2",
      timezone: "UTC",
    },
  },
];

describe("Update Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Get Updates", () => {
    it("should return updates with member information", async () => {
      jest
        .mocked(prisma.update.findMany)
        .mockResolvedValue(mockUpdates as never);

      const data = await updateRepository.getUpdates(
        ["member-1", "member-2"],
        [Mood.GREEN, Mood.YELLOW, Mood.RED],
        null,
      );

      expect(data).toEqual(mockUpdates);

      expect(prisma.update.findMany).toHaveBeenCalledWith({
        where: {
          memberId: {
            in: ["member-1", "member-2"],
          },
          mood: {
            in: [Mood.GREEN, Mood.YELLOW, Mood.RED],
          },
        },
        include: {
          member: true,
        },
      });
    });

    it("should filter updates by member IDs", async () => {
      const expectedUpdates = [mockUpdates[0], mockUpdates[1]];

      jest
        .mocked(prisma.update.findMany)
        .mockResolvedValue(expectedUpdates as never);

      const data = await updateRepository.getUpdates(
        ["member-1"],
        [Mood.GREEN, Mood.YELLOW, Mood.RED],
        null,
      );

      expect(data).toEqual(expectedUpdates);
      expect(data).toHaveLength(2);

      expect(prisma.update.findMany).toHaveBeenCalledWith({
        where: {
          memberId: {
            in: ["member-1"],
          },
          mood: {
            in: [Mood.GREEN, Mood.YELLOW, Mood.RED],
          },
        },
        include: {
          member: true,
        },
      });
    });

    it("should filter updates by mood", async () => {
      const expectedUpdates = [mockUpdates[0]];

      jest
        .mocked(prisma.update.findMany)
        .mockResolvedValue(expectedUpdates as never);

      const data = await updateRepository.getUpdates(
        ["member-1", "member-2"],
        [Mood.GREEN],
        null,
      );

      expect(data).toEqual(expectedUpdates);
      expect(data).toHaveLength(1);
      expect(data[0].mood).toBe(Mood.GREEN);

      expect(prisma.update.findMany).toHaveBeenCalledWith({
        where: {
          memberId: {
            in: ["member-1", "member-2"],
          },
          mood: {
            in: [Mood.GREEN],
          },
        },
        include: {
          member: true,
        },
      });
    });

    it("should filter updates by date when a date is provided", async () => {
      const expectedUpdates = [mockUpdates[0], mockUpdates[2]];

      jest
        .mocked(prisma.update.findMany)
        .mockResolvedValue(expectedUpdates as never);

      const data = await updateRepository.getUpdates(
        ["member-1", "member-2"],
        [Mood.GREEN, Mood.YELLOW, Mood.RED],
        "2026-09-01",
      );

      expect(data).toEqual(expectedUpdates);
      expect(data).toHaveLength(2);

      expect(prisma.update.findMany).toHaveBeenCalledWith({
        where: {
          memberId: {
            in: ["member-1", "member-2"],
          },
          mood: {
            in: [Mood.GREEN, Mood.YELLOW, Mood.RED],
          },
          date: "2026-09-01",
        },
        include: {
          member: true,
        },
      });
    });

    it("should filter updates by member, mood and date", async () => {
      const expectedUpdates = [mockUpdates[0]];

      jest
        .mocked(prisma.update.findMany)
        .mockResolvedValue(expectedUpdates as never);

      const data = await updateRepository.getUpdates(
        ["member-1"],
        [Mood.GREEN],
        "2026-09-01",
      );

      expect(data).toEqual(expectedUpdates);

      expect(prisma.update.findMany).toHaveBeenCalledWith({
        where: {
          memberId: {
            in: ["member-1"],
          },
          mood: {
            in: [Mood.GREEN],
          },
          date: "2026-09-01",
        },
        include: {
          member: true,
        },
      });
    });

    it("should not include date in the query when filteredDate is null", async () => {
      jest.mocked(prisma.update.findMany).mockResolvedValue([]);

      await updateRepository.getUpdates(["member-1"], [Mood.GREEN], null);

      expect(prisma.update.findMany).toHaveBeenCalledWith({
        where: {
          memberId: {
            in: ["member-1"],
          },
          mood: {
            in: [Mood.GREEN],
          },
        },
        include: {
          member: true,
        },
      });
    });

    it("should return an empty array when no updates match", async () => {
      jest.mocked(prisma.update.findMany).mockResolvedValue([]);

      const data = await updateRepository.getUpdates(
        ["member-2"],
        [Mood.GREEN],
        null,
      );

      expect(data).toEqual([]);
      expect(data).toHaveLength(0);
    });
  });

  describe("Create Update", () => {
    it("should create an update successfully", async () => {
      const mockValidUpdate = {
        id: "4",
        memberId: "member-1",
        date: "2026-09-03",
        text: "Worked on Next.js routing.",
        mood: Mood.RED,
      };

      jest
        .mocked(prisma.update.create)
        .mockResolvedValue(mockValidUpdate as never);

      await updateRepository.createUpdate(mockValidUpdate);

      expect(prisma.update.create).toHaveBeenCalledTimes(1);

      expect(prisma.update.create).toHaveBeenCalledWith({
        data: mockValidUpdate,
      });
    });

    it("should pass all update fields to Prisma when creating an update", async () => {
      const mockValidUpdate = {
        id: "5",
        memberId: "member-2",
        date: "2026-09-04",
        text: "Completed documentation updates.",
        mood: Mood.GREEN,
      };

      jest
        .mocked(prisma.update.create)
        .mockResolvedValue(mockValidUpdate as never);

      await updateRepository.createUpdate(mockValidUpdate);

      expect(prisma.update.create).toHaveBeenCalledWith({
        data: {
          id: "5",
          memberId: "member-2",
          date: "2026-09-04",
          text: "Completed documentation updates.",
          mood: Mood.GREEN,
        },
      });
    });
  });

  describe("Get Mood Breakdown", () => {
    it("should return the mood breakdown correctly", async () => {
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

      jest
        .mocked(prisma.update.groupBy)
        .mockResolvedValue(mockMoodBreakdown as never);

      const data = await updateRepository.getMoodBreakdown();

      expect(data).toEqual(mockMoodBreakdown);
    });

    it("should group updates by mood and count each mood", async () => {
      const mockMoodBreakdown = [
        {
          mood: Mood.GREEN,
          _count: {
            mood: 5,
          },
        },
      ];

      jest
        .mocked(prisma.update.groupBy)
        .mockResolvedValue(mockMoodBreakdown as never);

      await updateRepository.getMoodBreakdown();

      expect(prisma.update.groupBy).toHaveBeenCalledTimes(1);

      expect(prisma.update.groupBy).toHaveBeenCalledWith({
        by: ["mood"],
        _count: {
          mood: true,
        },
      });
    });

    it("should return an empty array when there are no updates", async () => {
      jest.mocked(prisma.update.groupBy).mockResolvedValue([]);

      const data = await updateRepository.getMoodBreakdown();

      expect(data).toEqual([]);
    });
  });
});
