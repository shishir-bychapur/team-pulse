import { memberAPI } from "@/src/apis/member";
import { notFound } from "next/navigation";

export default async function MemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await memberAPI.getSingleMember(id);

  if (!data.member) {
    return notFound();
  }

  return (
    <div>
      <h1 className="mx-2 max-w-xs text-3xl font-semibold leading-10 tracking-tight">
        Member Page
      </h1>
      <div className="mx-2">
        <h2 className="text-xl font-semibold">{data.member?.name}</h2>
        <p className="text-lg text-gray-600">{data.member?.role.name}</p>
        <p className="text-gray-700">{data.member?.timezone}</p>
      </div>
    </div>
  );
}
