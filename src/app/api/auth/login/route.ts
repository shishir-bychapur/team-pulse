import { authSchema } from "@/src/schema/auth";
import { authService } from "@/src/services/auth";
import { verifySession } from "@/src/utils/session";
import { NextResponse } from "next/server";

type PostResponseData = {
  errors?: string;
};

export async function POST(
  req: Request,
): Promise<NextResponse<PostResponseData>> {
  const session = await verifySession();
  if (session.isAuth) {
    return NextResponse.json(
      { errors: "You are already logged in." },
      { status: 403 },
    );
  }
  const data = await req.json();
  const validationResult = authSchema.safeParse(data);
  if (!validationResult.success) {
    return NextResponse.json(
      {
        errors: validationResult.error.message,
      },
      { status: 400 },
    );
  }
  try {
    await authService.login(data.username, data.password);
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        errors: "The entered username and/or password are incorrect!",
      },
      { status: 400 },
    );
  }
}
