import { memberService } from "@/src/services/member";
import { MemberWithRole } from "@/src/types/member";
import { NextResponse } from "next/server";

type ResponseData = {
  members?: MemberWithRole[];
  errors?: string;
};

export async function GET(): Promise<NextResponse<ResponseData>> {
  try {
    const members = await memberService.getMembers();

    return NextResponse.json({ members });
  } catch {
    return NextResponse.json(
      {
        errors: "Something went wrong. Please try again later.",
      },
      { status: 500 },
    );
  }
}
