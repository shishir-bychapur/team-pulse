import { Mood, Update } from "../types/update";

export const updates: Update[] = [
  {
    id: "1",
    memberId: "1",
    date: "2026-09-01",
    text: "Completed the new feature implementation.",
    mood: Mood.GREEN,
  },
  {
    id: "2",
    memberId: "2",
    date: "2026-09-02",
    text: "Faced some challenges with the design.",
    mood: Mood.YELLOW,
  },
  {
    id: "3",
    memberId: "3",
    date: "2026-09-03",
    text: "Had a productive meeting with the team.",
    mood: Mood.GREEN,
  },
  {
    id: "4",
    memberId: "1",
    date: "2026-09-04",
    text: "Encountered a critical bug in the system.",
    mood: Mood.RED,
  },
  {
    id: "5",
    memberId: "1",
    date: "2026-09-05",
    text: "Successfully resolved the bug.",
    mood: Mood.GREEN,
  },
];
