import { ActionItem } from "@/src/types/action";
import { NextResponse } from "next/server";
import { actionItems } from "@/src/data/action";

type ResponseData = {
  actions: ActionItem[];
};

export async function GET(req: Request): Promise<NextResponse<ResponseData>> {
  return NextResponse.json({ actions: actionItems });
}
