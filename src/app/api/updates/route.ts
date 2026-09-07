import { Update } from "../../../types/update";
import { moods, updates } from "../../../data/update";
import { NextResponse } from "next/server";
import { members } from "@/src/data/member";
import { updateSchema } from "@/src/schema/update";

type GetResponseData = {
  updates: Update[];
};

type PostResponseData = {
  errors?: string;
};

export async function GET(
  req: Request,
): Promise<NextResponse<GetResponseData>> {
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

export async function POST(
  req: Request,
): Promise<NextResponse<PostResponseData>> {
  const data = await req.json();
  const validationResult = updateSchema.safeParse(data);
  if (!validationResult.success) {
    return NextResponse.json(
      {
        errors: validationResult.error.message,
      },
      { status: 400 },
    );
  }

  const { memberId } = data;

  if (!members.find((member) => member.id === memberId)) {
    return NextResponse.json(
      {
        errors: "There is no member with the given memberId!",
      },
      { status: 403 },
    );
  }

  updates.push({ id: crypto.randomUUID(), ...data });
  return NextResponse.json({}, { status: 200 });
}
