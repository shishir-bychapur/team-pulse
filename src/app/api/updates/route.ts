import { Update } from "@/src/types/update";
import { updates } from "@/src/data/update";
import { NextResponse } from "next/server";

type ResponseData = {
  updates: Update[];
};

export async function GET(req: Request): Promise<NextResponse<ResponseData>> {
  return NextResponse.json({ updates });
}


