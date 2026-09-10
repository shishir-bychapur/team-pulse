"use client";

import { MemberWithRole } from "@/src/types/member";
import DateFilter from "../filters/date-filter";
import MemberFilter from "../filters/member-filter";
import MoodFilter from "../filters/mood-filter";
import UpdateCard from "./update";
import { UpdateWithMember } from "@/src/types/update";
import { useEffect, useState } from "react";
import { updateAPI } from "@/src/utils/apis/update";

export default function Updates({
  members,
  userId,
}: {
  members: MemberWithRole[];
  userId: string;
}) {
  const [memberFilter, setMemberFilter] = useState<string[]>([]);
  const [moodFilter, setMoodFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [updates, setUpdates] = useState<UpdateWithMember[]>([]);

  const isMyUpdates = memberFilter.length === 1 && memberFilter[0] === userId;

  const toggleMyUpdates = () => {
    if (isMyUpdates) {
      setMemberFilter([]);
    } else {
      setMemberFilter([userId]);
    }
  };

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const params = new URLSearchParams();

        memberFilter.forEach((member) => {
          params.append("members", member);
        });

        moodFilter.forEach((mood) => {
          params.append("moods", mood);
        });

        if (dateFilter !== "") {
          params.append("date", dateFilter);
        }

        const data = await updateAPI.getUpdates(params.toString());

        setUpdates(data.updates);
      } catch (error) {
        console.error("Error fetching updates:", error);
      }
    };

    fetchUpdates();
  }, [memberFilter, moodFilter, dateFilter]);

  return (
    <div>
      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Filter updates
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Filter by member, mood, or date to find specific updates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={toggleMyUpdates}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-sm transition-all ${
              isMyUpdates
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
                d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.5-1.632Z"
              />
            </svg>

            <span>My Updates</span>
          </button>

          <MemberFilter
            members={members}
            filter={memberFilter}
            setFilter={setMemberFilter}
          />

          <MoodFilter filter={moodFilter} setFilter={setMoodFilter} />

          <DateFilter filter={dateFilter} setFilter={setDateFilter} />
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Recent updates</h2>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {updates.length} {updates.length === 1 ? "update" : "updates"}
        </span>
      </div>

      {updates.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
            -
          </div>

          <h3 className="text-sm font-semibold text-gray-900">
            No updates found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your filters or create a new update.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {updates.map((update: UpdateWithMember) => (
            <UpdateCard
              key={update.id}
              update={update}
              memberName={update.member.name}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
