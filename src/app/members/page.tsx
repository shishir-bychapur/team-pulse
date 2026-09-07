import { AllMembers } from "@/src/components/members/all-members";
import { memberAPI } from "@/src/services/member";

const Members = async () => {
  const data = await memberAPI.getAllMembers();

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
