import { Member } from "@/generated/prisma/client";
import { Mood } from "@/generated/prisma/enums";

export interface Update {
  id: string;
  memberId: string;
  date: string;
  text: string;
  mood: Mood;
}

export interface UpdateWithMember {
  id: string;
  memberId: string;
  date: string;
  text: string;
  mood: Mood;
  member: Member;
}

export interface MoodBreakdownResult {
  mood: Mood;
  _count: {
    mood: number;
  };
}
