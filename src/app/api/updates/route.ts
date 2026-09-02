import { Update } from "@/src/types/update";
import { updates } from "@/src/data/update";
import { NextResponse } from "next/server";

type ResponseData = {
  updates: Update[];
};

export async function GET(req: Request): Promise<NextResponse<ResponseData>> {
  const url = new URL(req.url);
  const members = url.searchParams.get("members");
  const moods = url.searchParams.get("moods");
  const date = url.searchParams.get("date");

  console.log(members, moods, date);

  return NextResponse.json({ updates });
}
