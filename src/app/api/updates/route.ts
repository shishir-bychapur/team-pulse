import { Update } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { updateSchema } from "@/src/schema/update";
import { updateService } from "@/src/services/update";
import { verifySession } from "@/src/utils/session";

type GetResponseData = {
  updates?: Update[];
  errors?: string;
};

type PostResponseData = {
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

  const url = new URL(req.url);
  const updates = await updateService.getUpdates(
    url.searchParams.getAll("members"),
    url.searchParams.getAll("moods"),
    url.searchParams.get("date"),
  );

  return NextResponse.json({
    updates,
  });
}

export async function POST(
  req: Request,
): Promise<NextResponse<PostResponseData>> {
  const session = await verifySession();
  if (!session.isAuth) {
    return NextResponse.json(
      { errors: "Unauthorized. Please log in." },
      { status: 401 },
    );
  }
  const data = await req.json();
  const validationResult = updateSchema.safeParse(data);
  if (!validationResult.success) {
    return NextResponse.json(
      {
        errors: validationResult.error.message,
      },
      { status: 400 },
    );
  }

  try {
    await updateService.createUpdate(data);
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        errors: "There is no member with the given memberId!",
      },
      { status: 403 },
    );
  }
}
