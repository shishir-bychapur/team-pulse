import { members } from "@/src/data/member";
import { Member } from "@/src/types/member";
import { NextResponse } from "next/server";

type ResponseData = {
  members: Member[];
};

export async function GET(req: Request): Promise<NextResponse<ResponseData>> {
  return NextResponse.json({ members });
}
