import { Mood } from "../types/update";
import { updateRepository } from "./update";
import { updates } from "../data/update";

jest.mock("@/src/data/update", () => ({
  moods: ["RED", "YELLOW", "GREEN"],
  updates: [
    {
      id: "1",
      memberId: "member-1",
      mood: "GREEN",
      date: "2026-09-01",
      text: "Update 1",
    },
    {
      id: "2",
      memberId: "member-1",
      mood: "YELLOW",
      date: "2026-09-02",
      text: "Update 2",
    },
    {
      id: "3",
      memberId: "member-2",
      mood: "RED",
      date: "2026-09-01",
      text: "Update 3",
    },
  ],
}));

describe("Update Repository", () => {
  describe("Get Updates", () => {
    it("should return updates filtered by member", () => {
      const data = updateRepository.getUpdates(
        ["member-1"],
        ["GREEN", "YELLOW", "RED"],
        null,
      );

      expect(data).toHaveLength(2);

      expect(data).toEqual([
        {
          id: "1",
          memberId: "member-1",
          mood: "GREEN",
          date: "2026-09-01",
          text: "Update 1",
        },
        {
          id: "2",
          memberId: "member-1",
          mood: "YELLOW",
          date: "2026-09-02",
          text: "Update 2",
        },
      ]);
    });

    it("should return updates filtered by mood", () => {
      const data = updateRepository.getUpdates(
        ["member-1", "member-2"],
        ["GREEN"],
        null,
      );

      expect(data).toHaveLength(1);
      expect(data[0].mood).toBe("GREEN");
    });

    it("should return updates filtered by date", () => {
      const data = updateRepository.getUpdates(
        ["member-1", "member-2"],
        ["GREEN", "YELLOW", "RED"],
        "2026-09-01",
      );

      expect(data).toHaveLength(2);

      expect(data.every((update) => update.date === "2026-09-01")).toBe(true);
    });

    it("should return updates filtered by member, mood and date", () => {
      const data = updateRepository.getUpdates(
        ["member-1"],
        ["GREEN"],
        "2026-09-01",
      );

      expect(data).toHaveLength(1);

      expect(data[0]).toEqual({
        id: "1",
        memberId: "member-1",
        mood: "GREEN",
        date: "2026-09-01",
        text: "Update 1",
      });
    });

    it("should return an empty array when no updates match", () => {
      const data = updateRepository.getUpdates(["member-2"], ["GREEN"], null);

      expect(data).toEqual([]);
    });
  });

  describe("Create Update", () => {
    it("should create an update successfully", () => {
      const mockValidUpdate = {
        id: "4",
        memberId: "member-1",
        date: "2026-09-01",
        text: "Worked on next.js routing.",
        mood: Mood.RED,
      };

      expect(updates).toHaveLength(3);

      updateRepository.createUpdate(mockValidUpdate);

      expect(updates).toHaveLength(4);
      expect(updates).toContainEqual(mockValidUpdate);
    });
  });
});
