export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-8">
          <div className="h-9 w-36 rounded bg-gray-200" />

          <div className="mt-3 h-4 w-72 max-w-full rounded bg-gray-200" />
        </div>

        <div className="mb-5">
          <div className="h-4 w-20 rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-1 items-center gap-3">
                  <div className="size-11 shrink-0 rounded-full bg-gray-200" />

                  <div className="flex-1">
                    <div className="h-5 w-28 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-20 rounded bg-gray-200" />
                  </div>
                </div>

                <div className="size-5 rounded bg-gray-100" />
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4">
                <div className="h-6 w-24 rounded-full bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
