import { Update } from "../../../types/update";
import { moods, updates } from "../../../data/update";
import { NextResponse } from "next/server";
import { members } from "@/src/data/member";

type ResponseData = {
  updates: Update[];
};

export async function GET(req: Request): Promise<NextResponse<ResponseData>> {
  const url = new URL(req.url);
  let filteredMembers = url.searchParams.getAll("members");
  let filteredMoods = url.searchParams.getAll("moods");
  const date = url.searchParams.get("date");

  if (!filteredMembers.length) {
    filteredMembers = members.map((member) => member.id);
  }

  if (!filteredMoods.length) {
    filteredMoods = moods;
  }

  const filteredUpdates = updates.filter(
    (update) =>
      filteredMembers.includes(update.memberId) &&
      filteredMoods.includes(update.mood) &&
      (!date || update.date === date),
  );

  return NextResponse.json({
    updates: filteredUpdates,
  });
}
