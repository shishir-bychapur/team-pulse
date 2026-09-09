import { NextResponse } from "next/server";
import { updateService } from "@/src/services/update";
import { verifySession } from "@/src/utils/session";
import { MoodBreakdownResult } from "@/src/types/update";

type GetResponseData = {
  moods?: MoodBreakdownResult[];
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
    const moods = await updateService.getMoodBreakdown();

    return NextResponse.json({
      moods,
    });
  } catch {
    return NextResponse.json(
      {
        errors: "Something went wrong. Please try again later.",
      },
      { status: 500 },
    );
  }
}
