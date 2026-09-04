"use client";

import MoodFilter from "../../components/filters/mood-filter";
import DateFilter from "../../components/filters/date-filter";
import UpdateCard from "../../components/updates/update";
import MemberFilter from "../../components/filters/member-filter";
import { useState, useEffect } from "react";
import { Member } from "../../types/member";
import { Update } from "../../types/update";
import Link from "next/link";

const Updates = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [memberFilter, setMemberFilter] = useState<string[]>([]);
  const [moodFilter, setMoodFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/members");
        const data: { members: Member[] } = await response.json();
        setMembers(data.members);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  const addParams = () => {
    const params = new URLSearchParams();

    memberFilter.forEach((member) => params.append("members", member));
    moodFilter.forEach((mood) => params.append("moods", mood));

    if (dateFilter != "") {
      params.append("date", dateFilter);
    }

    return params.toString();
  };

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const params = addParams();
        const response = await fetch("/api/updates?" + params);
        const data: { updates: Update[] } = await response.json();
        setUpdates(data.updates);
      } catch (error) {
        console.error("Error fetching updates:", error);
      }
    };

    fetchUpdates();
  }, [memberFilter, moodFilter, dateFilter]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Updates
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Keep track of your team{"'"}s latest updates.
            </p>
          </div>

          <Link
            href="/updates/new"
            className="inline-flex w-fit items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Create Update
          </Link>
        </div>

        {/* Filters */}
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
            <MemberFilter
              members={members}
              filter={memberFilter}
              setFilter={setMemberFilter}
            />

            <MoodFilter filter={moodFilter} setFilter={setMoodFilter} />

            <DateFilter filter={dateFilter} setFilter={setDateFilter} />
          </div>
        </section>

        {/* Results header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent updates
          </h2>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {updates.length} {updates.length === 1 ? "update" : "updates"}
          </span>
        </div>

        {/* Updates */}
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
            {updates.map((update: Update) => (
              <UpdateCard
                key={update.id}
                update={update}
                memberName={
                  members.find((m) => m.id === update.memberId)?.name || ""
                }
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default Updates;
