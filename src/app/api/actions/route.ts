import { ActionItemWithOwner } from "@/src/types/action";
import { NextResponse } from "next/server";
import { actionSchema } from "@/src/schema/action";
import { actionService } from "@/src/services/action";
import { verifySession } from "@/src/utils/session";

type GetResponseData = {
  actions?: ActionItemWithOwner[];
  error?: string;
};

type PostResponseData = {
  id?: string;
  errors?: string;
};

export async function GET(
  req: Request,
): Promise<NextResponse<GetResponseData>> {
  const session = await verifySession();
  if (!session.isAuth) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 },
    );
  }

  const actions = await actionService.getActions();
  return NextResponse.json({ actions });
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
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        errors: "There is no member with the given ownerId!",
      },
      { status: 403 },
    );
  }
}
