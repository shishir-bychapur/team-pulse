import { memberService } from "@/src/services/member";
import { MemberWithRole } from "@/src/types/member";
import { NextResponse } from "next/server";

type RequestParams = {
  id: string;
};

type ResponseData = {
  member?: MemberWithRole | null;
  errors?: string;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<RequestParams> },
): Promise<NextResponse<ResponseData>> {
  try {
    const { id } = await params;

    const member = await memberService.getMember(id);

    if (!member) {
      return NextResponse.json({ member: null }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch {
    return NextResponse.json(
      {
        errors: "Something went wrong. Please try again later.",
      },
      { status: 500 },
    );
  }
}
