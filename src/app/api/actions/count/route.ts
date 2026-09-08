import { actionService } from "@/src/services/action";
import { ActionStatus } from "@/src/types/action";
import { verifySession } from "@/src/utils/session";
import { NextResponse } from "next/server";

type GetResponseData = {
  count?: number;
  error?: string;
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
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  if (
    !status ||
    !([ActionStatus.CLOSED, ActionStatus.OPEN] as string[]).includes(status)
  ) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  const count = actionService.getActionsByStatus(status as ActionStatus).length;

  return NextResponse.json({ count });
}
