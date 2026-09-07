import { ActionItem, ActionStatus } from "@/src/types/action";
import Link from "next/link";

export default function ActionCard({
  action,
  memberName,
}: {
  action: ActionItem;
  memberName: string;
}) {
  const isOpen = action.status === ActionStatus.OPEN;

  return (
    <li className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-md">
      <div
        className={`absolute inset-y-0 left-0 w-1 ${
          isOpen ? "bg-blue-500" : "bg-emerald-500"
        }`}
      />

      <div className="p-5 pl-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium text-gray-700">{memberName}</span>
            <span className="text-gray-300">•</span>
            <span>Due {action.dueDate}</span>
          </div>

          {isOpen ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Open
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
              <svg
                className="h-3.5 w-3.5"
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

        <div className="mt-3">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            {action.title}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-400">Action item</span>

          <Link
            href={`/actions/${action.id}`}
            className="text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 hover:text-blue-700"
          >
            View details →
          </Link>
        </div>
      </div>
    </li>
  );
}
