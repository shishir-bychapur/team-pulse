import { NextResponse } from "next/server";
import { members } from "@/src/data/member";
import { actionSchema } from "@/src/schema/action";
import { actionItems } from "@/src/data/action";

type ResponseData = {
  errors?: string;
};

export async function POST(req: Request): Promise<NextResponse<ResponseData>> {
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

  const { ownerId } = data;

  if (!members.find((member) => member.id === ownerId)) {
    return NextResponse.json(
      {
        errors: "There is no member with the given ownerId!",
      },
      { status: 403 },
    );
  }

  actionItems.push({ id: crypto.randomUUID(), ...data });
  return NextResponse.json({}, { status: 200 });
}
