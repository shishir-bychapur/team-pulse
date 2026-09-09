import Updates from "@/src/components/updates/updates";
import { memberService } from "@/src/services/member";
import { verifySession } from "@/src/utils/session";
import Link from "next/link";

const UpdatePage = async () => {
  const members = await memberService.getMembers();
  const session = await verifySession();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Updates
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Keep track of your team{"'"}s latest updates.
            </p>
          </div>

          <Link
            href="/updates/new"
            className="inline-flex w-fit items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Create Update
          </Link>
        </div>
        <Updates members={members} userId={session.id ?? ""} />
      </div>
    </main>
  );
};

export default UpdatePage;
