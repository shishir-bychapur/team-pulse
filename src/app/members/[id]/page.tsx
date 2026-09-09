import { memberAPI } from "@/src/utils/apis/member";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await memberAPI.getSingleMember(id);

  if (!data.member) {
    return notFound();
  }

  const member = data.member;
  const initial = member.name.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/members"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
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
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          Back to members
        </Link>

        <div className="mb-6">
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Member Details
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View information about this team member.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gradient-to-br from-blue-50 to-white px-6 py-8 sm:px-8">
            <div className="flex items-center gap-5">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-sm">
                {initial}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-2xl font-bold text-gray-900">
                  {member.name}
                </h2>

                <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {member.role.name}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Member Information
            </h3>

            <dl className="divide-y divide-gray-100">
              {/* Role */}
              <div className="flex items-center justify-between gap-6 py-4 first:pt-0">
                <dt className="flex items-center gap-3 text-sm font-medium text-gray-500">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5 text-gray-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.75a6 6 0 0 0-12 0m12 0v.75H6v-.75m12 0a6 6 0 0 0-12 0M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
                      />
                    </svg>
                  </div>
                  Role
                </dt>

                <dd className="text-right text-sm font-semibold text-gray-900">
                  {member.role.name}
                </dd>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between gap-6 py-4">
                <dt className="flex items-center gap-3 text-sm font-medium text-gray-500">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5 text-gray-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8.25 10.89 13.51a2.025 2.025 0 0 0 2.22 0L21 8.25M5.25 19.5h13.5A2.25 2.25 0 0 0 21 17.25V6.75a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  </div>
                  Email
                </dt>

                <dd className="text-right text-sm font-semibold text-gray-900">
                  {member.email}
                </dd>
              </div>

              {/* Timezone */}
              <div className="flex items-center justify-between gap-6 py-4">
                <dt className="flex items-center gap-3 text-sm font-medium text-gray-500">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5 text-gray-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 18Z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75v5.25l3 1.5"
                      />
                    </svg>
                  </div>
                  Timezone
                </dt>

                <dd className="text-right text-sm font-semibold text-gray-900">
                  {member.timezone}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </main>
  );
}
