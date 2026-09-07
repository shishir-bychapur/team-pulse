import { ActionItem } from "@/src/types/action";
import { NextResponse } from "next/server";
import { actionSchema } from "@/src/schema/action";
import { actionService } from "@/src/services/action";

type GetResponseData = {
  action: ActionItem | null;
};

type PatchResponseData = {
  errors?: string;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<GetResponseData>> {
  const { id } = await params;
  const action = actionService.getAction(id);
  if (!action) {
    return NextResponse.json({ action: null }, { status: 404 });
  }

  return NextResponse.json({ action });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<PatchResponseData>> {
  const data = await req.json();
  const validationResult = actionSchema.safeParse(data);
  if (!validationResult.success) {
    return NextResponse.json(
      {
        errors: validationResult.error.message,
      },
      { status: 400 },
    );
  }

  const { id } = await params;

  try {
    const index = actionService.editAction(id, data);
    if (index === -1) {
      return NextResponse.json(
        {
          errors: "There is no action item with the given id!",
        },
        { status: 404 },
      );
    }
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        errors: "There is no member with the given ownerId!",
      },
      { status: 403 },
    );
  }
}
