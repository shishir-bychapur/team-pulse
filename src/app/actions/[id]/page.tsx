import { ActionItem, ActionStatus } from "@/src/types/action";
import { Member } from "@/src/types/member";
import { notFound } from "next/navigation";

export default async function ActionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(process.env.URL + `/api/actions/${id}`);

  const data: { action: ActionItem | null } = await response.json();

  if (!data.action) {
    return notFound();
  }

  const memberResponse = await fetch(
    process.env.URL + `/api/members/${data.action.ownerId}`,
  );
  const memberData: { member: Member | null } = await memberResponse.json();

  const { action } = data;
  const isOpen = action.status === ActionStatus.OPEN;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <a
        href="/actions"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        <span>←</span>
        Back to actions
      </a>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className={`h-1.5 ${isOpen ? "bg-blue-500" : "bg-emerald-500"}`} />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Action item
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {action.title}
              </h1>
            </div>

            {isOpen ? (
              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Open
              </span>
            ) : (
              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 0 1 .006 1.414l-8.25 8.25a1 1 0 0 1-1.414 0l-3.75-3.75a1 1 0 0 1 1.414-1.414l3.043 3.043 7.543-7.543a1 1 0 0 1 1.414 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                Closed
              </span>
            )}
          </div>

          <div className="mt-8 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Owner
              </p>

              <p className="mt-2 font-medium text-gray-900">
                {memberData.member?.name ?? "Unknown"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Due date
              </p>

              <p className="mt-2 font-medium text-gray-900">{action.dueDate}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <p className="text-xs text-gray-400">
              Action ID:{" "}
              <span className="font-mono text-gray-500">{action.id}</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
