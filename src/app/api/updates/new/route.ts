import { NextResponse } from "next/server";
import { members } from "@/src/data/member";
import { updateSchema } from "@/src/schema/update";

type ResponseData = {
  errors?: string;
};

export async function POST(req: Request): Promise<NextResponse<ResponseData>> {
  const data = await req.json();
  const validationResult = updateSchema.safeParse(data);
  if (!validationResult.success) {
    return NextResponse.json(
      {
        errors: validationResult.error.message,
      },
      { status: 400 },
    );
  }

  const { memberId } = data;

  if (!members.find((member) => member.id === memberId)) {
    return NextResponse.json(
      {
        errors: "There is no member with the given memberId!",
      },
      { status: 403 },
    );
  }

  members.push({ id: crypto.randomUUID(), ...data });
  return NextResponse.json({}, { status: 200 });
}
