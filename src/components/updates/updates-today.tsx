export default function UpdatesToday({ count }: { count: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Updates today</p>

          <p className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
            {count}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Team updates submitted today
          </p>
        </div>

        <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50">
          <svg
            className="size-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A3.375 3.375 0 0 0 11.25 11.625v2.625m8.25 0v3.375a3.375 3.375 0 0 1-3.375 3.375H7.875A3.375 3.375 0 0 1 4.5 17.625V14.25m15 0H4.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
