import SingleMember from "@/src/components/members/single-member";

export default async function MemberPage() {
  return (
    <div>
      <h1 className="mx-2 max-w-xs text-3xl font-semibold leading-10 tracking-tight">
        Member Page
      </h1>
      <SingleMember />
    </div>
  );
}
