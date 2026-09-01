import { Member } from "@/src/types/member";
import { AllMembers } from "@/src/components/members/all-members";

const Members = async () => {
  const response = await fetch(process.env.URL + "/api/members");
  const data: { members: Member[] } = await response.json();

  return (
    <div>
      <h1 className="mx-2 max-w-xs text-3xl font-semibold leading-10 tracking-tight">
        Members
      </h1>
      <AllMembers members={data.members} />
    </div>
  );
};

export default Members;
