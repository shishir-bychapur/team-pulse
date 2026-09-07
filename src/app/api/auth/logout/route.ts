import { authService } from "@/src/services/auth";
import { NextResponse } from "next/server";

type GetResponseData = {
  errors?: string;
};

export async function GET(
  req: Request,
): Promise<NextResponse<GetResponseData>> {
  await authService.logout();
  return NextResponse.json({}, { status: 200 });
}
