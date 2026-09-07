import { memberService } from "@/src/services/member";
import { Member } from "@/src/types/member";
import { NextResponse } from "next/server";

type RequestParams = {
  id: string;
};

type ResponseData = {
  member: Member | null;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<RequestParams> },
): Promise<NextResponse<ResponseData>> {
  const { id } = await params;
  const member = memberService.getMember(id);
  if (!member) {
    return NextResponse.json({ member: null }, { status: 404 });
  }
  return NextResponse.json({ member });
}
