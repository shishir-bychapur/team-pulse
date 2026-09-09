import { actionService } from "@/src/services/action";
import { ActionStatus } from "@/generated/prisma/enums";
import { verifySession } from "@/src/utils/session";
import { NextResponse } from "next/server";

type GetResponseData = {
  count?: number;
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
  const status = url.searchParams.get("status");

  if (
    !status ||
    !([ActionStatus.CLOSED, ActionStatus.OPEN] as string[]).includes(status)
  ) {
    return NextResponse.json({ errors: "Invalid status." }, { status: 400 });
  }

  try {
    const count = await actionService.getActionsByStatus(
      status as ActionStatus,
    );

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json(
      { errors: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
