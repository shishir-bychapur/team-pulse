export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl animate-pulse">
        <div className="mb-6 h-5 w-32 rounded bg-gray-200" />

        <div className="mb-6">
          <div className="h-4 w-28 rounded bg-gray-200" />

          <div className="mt-3 h-9 w-52 rounded bg-gray-200" />

          <div className="mt-3 h-4 w-80 max-w-full rounded bg-gray-200" />
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-8 sm:px-8">
            <div className="flex items-center gap-5">
              <div className="size-16 shrink-0 rounded-full bg-gray-200" />

              <div className="flex-1">
                <div className="h-7 w-40 rounded bg-gray-200" />

                <div className="mt-3 h-7 w-24 rounded-full bg-gray-200" />
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <div className="mb-6 h-5 w-40 rounded bg-gray-200" />

            <div className="divide-y divide-gray-100">
              <div className="flex items-center justify-between gap-6 py-4 first:pt-0">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-gray-200" />

                  <div className="h-4 w-12 rounded bg-gray-200" />
                </div>

                <div className="h-4 w-24 rounded bg-gray-200" />
              </div>

              <div className="flex items-center justify-between gap-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-gray-200" />

                  <div className="h-4 w-20 rounded bg-gray-200" />
                </div>

                <div className="h-4 w-32 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
