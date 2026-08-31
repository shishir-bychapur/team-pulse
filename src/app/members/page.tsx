import { AllMembers } from "@/src/components/members/all-members";

const Members = () => {
  return (
    <div>
      <h1 className="mx-2 max-w-xs text-3xl font-semibold leading-10 tracking-tight">
        Members
      </h1>
      <AllMembers />
    </div>
  );
};

export default Members;
