export default function DateFilter() {
  return (
    <details className="group relative">
      <summary className="flex items-center gap-2 border-b border-gray-300 pb-1 text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-medium"> Date </span>

        <span className="transition-transform group-open:-rotate-180">
          <svg
            aria-hidden="true"
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
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </summary>

      <div className="z-auto w-64 divide-y divide-gray-300 rounded border border-gray-300 bg-white shadow-sm group-open:absolute group-open:start-0 group-open:top-8">
        <div className="flex items-center justify-between px-3 py-2">
          <button
            type="button"
            className="text-sm text-gray-700 underline transition-colors hover:text-gray-900"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center gap-3 p-3">
          <label htmlFor="date">
            <span className="text-sm text-gray-700">Date</span>
            <input
              type="date"
              id="date"
              value="0"
              className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
            />
          </label>
        </div>
      </div>
    </details>
  );
}
