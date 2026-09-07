export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1.5 w-full animate-pulse bg-gray-200" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="w-full max-w-xl">
              <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />

              <div className="mt-3 h-8 w-3/4 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="h-9 w-24 animate-pulse rounded-md bg-gray-200" />
          </div>

          <div className="mt-8 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />

              <div className="mt-3 h-5 w-32 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />

              <div className="mt-3 h-5 w-28 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          <div className="mt-6 flex justify-between border-t border-gray-100 pt-5">
            <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />

            <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </main>
  );
}
