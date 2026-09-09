"use client";

import { MemberWithRole } from "@/src/types/member";
import Card from "../card/card";
import { useRouter } from "next/navigation";

export function AllMembers({ members }: { members: MemberWithRole[] }) {
  const router = useRouter();

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {members.length} {members.length === 1 ? "member" : "members"}
        </p>
      </div>

      {members.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.75a6 6 0 0 0-12 0m12 0v.75H6v-.75m12 0a6 6 0 0 0-12 0M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
              />
            </svg>
          </div>

          <h2 className="mt-4 text-sm font-semibold text-gray-900">
            No members found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            There are currently no members to display.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member) => (
            <Card
              key={member.id}
              title={member.name}
              description={member.role.name}
              onClick={() => {
                router.push(`/members/${member.id}`);
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
