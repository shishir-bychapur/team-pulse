import { Update } from "../../../types/update";
import { NextResponse } from "next/server";
import { updateSchema } from "@/src/schema/update";
import { updateService } from "@/src/services/update";

type GetResponseData = {
  updates: Update[];
};

type PostResponseData = {
  errors?: string;
};

export async function GET(
  req: Request,
): Promise<NextResponse<GetResponseData>> {
  const updates = updateService.getUpdates(new URL(req.url));

  return NextResponse.json({
    updates,
  });
}

export async function POST(
  req: Request,
): Promise<NextResponse<PostResponseData>> {
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
    updateService.createUpdate(data);
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
