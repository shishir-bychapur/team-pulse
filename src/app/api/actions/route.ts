import { ActionItemWithOwner } from "@/src/types/action";
import { NextResponse } from "next/server";
import { actionSchema } from "@/src/schema/action";
import { actionService } from "@/src/services/action";
import { verifySession } from "@/src/utils/session";

type GetResponseData = {
  actions?: ActionItemWithOwner[];
  errors?: string;
};

type PostResponseData = {
  id?: string;
  errors?: string;
};

export async function GET(): Promise<NextResponse<GetResponseData>> {
  const session = await verifySession();

  if (!session.isAuth) {
    return NextResponse.json(
      { errors: "Unauthorized. Please log in." },
      { status: 401 },
    );
  }

  try {
    const actions = await actionService.getActions();

    return NextResponse.json({ actions });
  } catch {
    return NextResponse.json(
      {
        errors: "Something went wrong. Please try again later.",
      },
      { status: 500 },
    );
  }
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
    const id = await actionService.createAction(data);

    return NextResponse.json({ id }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        errors: "Something went wrong. Please try again later.",
      },
      { status: 500 },
    );
  }
}
