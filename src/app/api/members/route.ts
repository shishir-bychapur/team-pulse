import { memberService } from "@/src/services/member";
import { MemberWithRole } from "@/src/types/member";
import { NextResponse } from "next/server";

type ResponseData = {
  members: MemberWithRole[];
};

export async function GET(req: Request): Promise<NextResponse<ResponseData>> {
  const members = await memberService.getMembers();
  return NextResponse.json({ members });
}
