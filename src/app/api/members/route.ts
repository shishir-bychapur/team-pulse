import { memberService } from "@/src/services/member";
import { Member } from "@/src/types/member";
import { NextResponse } from "next/server";

type ResponseData = {
  members: Member[];
};

export async function GET(req: Request): Promise<NextResponse<ResponseData>> {
  const members = memberService.getMembers();
  return NextResponse.json({ members });
}
