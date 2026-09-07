import { Dispatch, SetStateAction } from "react";
import DateInput from "../input/date";

export default function DateFilter({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}) {
  return (
    <details className="group relative">
      <summary
        className={`flex cursor-pointer list-none items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-sm transition-all [&::-webkit-details-marker]:hidden ${
          filter
            ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
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
            d="M6.75 3v2.25M17.25 3v2.25M3 9.75h18M4.5 5.25h15a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20.25V6.75a1.5 1.5 0 0 1 1.5-1.5Z"
          />
        </svg>

        <span>Date</span>

        {filter && (
          <span className="max-w-28 truncate rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
            {filter}
          </span>
        )}

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
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-500">{filter || "Select a date"}</p>

          <button
            type="button"
            className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            onClick={() => setFilter("")}
          >
            Reset
          </button>
        </div>

        <div className="p-4">
          <DateInput date={filter} setDate={setFilter} />
        </div>
      </div>
    </details>
  );
}
