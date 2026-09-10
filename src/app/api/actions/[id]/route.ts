import { ActionItem } from "@/src/types/action";
import { NextResponse } from "next/server";
import { actionSchema } from "@/src/schema/action";
import { actionService } from "@/src/services/action";
import { verifySession } from "@/src/utils/session";

type GetResponseData = {
  action?: ActionItem | null;
  errors?: string;
};

type PatchResponseData = {
  errors?: string;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<GetResponseData>> {
  const session = await verifySession();

  if (!session.isAuth) {
    return NextResponse.json(
      { errors: "Unauthorized. Please log in." },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const action = await actionService.getAction(id);
    return NextResponse.json({ action });
  } catch {
    return NextResponse.json(
      { errors: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<PatchResponseData>> {
  const session = await verifySession();

  if (!session.isAuth) {
    return NextResponse.json(
      { errors: "Unauthorized. Please log in." },
      { status: 401 },
    );
  }

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

  try {
    const { id } = await params;

    await actionService.editAction(id, data);

    return NextResponse.json({}, { status: 200 });
  } catch {
    return NextResponse.json(
      { errors: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
