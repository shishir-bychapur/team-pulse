import { actionAPI } from "@/src/apis/action";
import { memberAPI } from "@/src/apis/member";
import { ActionStatus } from "@/src/types/action";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ActionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await actionAPI.getSingleAction(id);

  if (!data.action) {
    return notFound();
  }

  const memberData = await memberAPI.getSingleMember(data.action.ownerId);

  const { action } = data;
  const isOpen = action.status === ActionStatus.OPEN;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/actions"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        <span>←</span>
        Back to actions
      </Link>

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

          <div className="flex justify-between mt-6 border-t border-gray-100 pt-5">
            <p className="text-xs text-gray-400">
              Action ID:{" "}
              <span className="font-mono text-gray-500">{action.id}</span>
            </p>
            <Link href={`/actions/${id}/edit`}>
              <svg
                width="16px"
                height="16px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z"
                    fill="#0F0F0F"
                  ></path>
                </g>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
