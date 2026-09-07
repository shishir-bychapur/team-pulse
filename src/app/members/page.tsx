import { AllMembers } from "@/src/components/members/all-members";
import { memberAPI } from "@/src/utils/apis/member";

const Members = async () => {
  const data = await memberAPI.getAllMembers();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Members
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Browse and view information about your team members.
          </p>
        </div>

        <AllMembers members={data.members} />
      </div>
    </main>
  );
};

export default Members;
