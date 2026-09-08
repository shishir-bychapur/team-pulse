import { authService } from "@/src/services/auth";
import { verifySession } from "@/src/utils/session";
import { NextResponse } from "next/server";

type GetResponseData = {
  errors?: string;
};

export async function GET(
  req: Request,
): Promise<NextResponse<GetResponseData>> {
  const session = await verifySession();
  if (!session.isAuth) {
    return NextResponse.json(
      { errors: "Unauthorized. Please log in." },
      { status: 401 },
    );
  }
  await authService.logout();
  return NextResponse.json({}, { status: 200 });
}
