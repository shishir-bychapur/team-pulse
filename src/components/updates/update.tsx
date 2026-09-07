import { Update } from "@/src/types/update";
import Badge from "../badge/badge";

export default function UpdateCard({
  update,
  memberName,
}: {
  update: Update;
  memberName: string;
}) {
  return (
    <li className="rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {memberName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-gray-900">
                {memberName}
              </h3>

              <p className="text-xs text-gray-500">{update.date}</p>
            </div>
          </div>

          <Badge mood={update.mood} />
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3">
          <p className="text-sm leading-6 text-gray-700">{update.text}</p>
        </div>
      </div>
    </li>
  );
}
