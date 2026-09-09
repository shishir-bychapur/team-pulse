export default function OpenActions({ count }: { count: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Open actions</p>

          <p className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
            {count}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Actions that still need attention
          </p>
        </div>

        <div className="flex size-11 items-center justify-center rounded-xl bg-orange-50">
          <svg
            className="size-5 text-orange-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
