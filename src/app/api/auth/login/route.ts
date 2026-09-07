import { authSchema } from "@/src/schema/auth";
import { authService } from "@/src/services/auth";
import { NextResponse } from "next/server";

type PostResponseData = {
  errors?: string;
};

export async function POST(
  req: Request,
): Promise<NextResponse<PostResponseData>> {
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

  await authService.login(data.username, data.password);
  return NextResponse.json({}, { status: 200 });
}
