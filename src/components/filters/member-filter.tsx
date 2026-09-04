import { Member } from "../../types/member";
import { Dispatch, SetStateAction } from "react";
import CheckBox from "../input/checkbox";

export default function MemberFilter({
  members,
  filter,
  setFilter,
}: {
  members: Member[];
  filter: string[];
  setFilter: Dispatch<SetStateAction<string[]>>;
}) {
  const callback = (isChecked: boolean, id: string) => {
    if (isChecked) {
      setFilter([...filter].filter((memberId) => memberId !== id));
    } else {
      setFilter([...filter, id]);
    }
  };

  return (
    <details className="group relative">
      <summary
        className={`flex cursor-pointer list-none items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-sm transition-all [&::-webkit-details-marker]:hidden ${
          filter.length > 0
            ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        {/* Filter icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 4.5h18M6.75 9.75h10.5M10.5 15h3"
          />
        </svg>

        <span>Member</span>

        {filter.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
            {filter.length}
          </span>
        )}

        {/* Chevron */}
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="ml-1 size-4 transition-transform group-open:rotate-180"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </summary>

      <div className="absolute start-0 top-12 z-20 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Members</p>
            <p className="text-xs text-gray-500">
              {filter.length === 0
                ? "All members"
                : `${filter.length} selected`}
            </p>
          </div>

          {filter.length > 0 && (
            <button
              onClick={() => setFilter([])}
              type="button"
              className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Reset
            </button>
          )}
        </div>

        {/* Options */}
        <fieldset className="max-h-64 overflow-y-auto p-2">
          <legend className="sr-only">Members</legend>

          <div className="flex flex-col">
            {members?.map((member) => {
              return (
                <label
                  key={member.id}
                  htmlFor={member.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
                >
                  <CheckBox
                    id={member.id}
                    filter={filter}
                    callback={callback}
                  />

                  <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-gray-700">
                      {member.name}
                    </span>

                    <span className="shrink-0 text-xs text-gray-400">
                      {member.role.name}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>
    </details>
  );
}
