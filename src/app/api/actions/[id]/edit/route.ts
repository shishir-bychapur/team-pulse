import { NextResponse } from "next/server";
import { members } from "@/src/data/member";
import { actionSchema } from "@/src/schema/action";
import { actionItems } from "@/src/data/action";

type ResponseData = {
  errors?: string;
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ResponseData>> {
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

  const { id } = await params;

  const index = actionItems.findIndex((action) => action.id === id);

  if (index === -1) {
    return NextResponse.json(
      {
        errors: "There is no action item with the given id!",
      },
      { status: 404 },
    );
  }

  actionItems[index] = { ...data, id };
  return NextResponse.json({}, { status: 200 });
}
