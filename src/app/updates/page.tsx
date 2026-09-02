"use client";

import MoodFilter from "@/src/components/filters/mood-filter";
import DateFilter from "@/src/components/filters/date-filter";
import UpdateCard from "@/src/components/updates/update";
import { Update } from "@/src/types/update";
import MemberFilter from "@/src/components/filters/member-filter";
import { useState, useEffect } from "react";
import { Member } from "@/src/types/member";

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

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const params = new URLSearchParams();
        memberFilter.forEach((member) => params.append("members", member));
        moodFilter.forEach((mood) => params.append("moods", mood));
        params.append("date", dateFilter);
        const response = await fetch("/api/updates" + params.toString());
        const data: { updates: Update[] } = await response.json();
        setUpdates(data.updates);
      } catch (error) {
        console.error("Error fetching updates:", error);
      }
    };

    fetchUpdates();
  }, [memberFilter, moodFilter, dateFilter]);

  return (
    <div className="mx-2">
      <div className="flex gap-4 mt-4 justify-center">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight">
          Updates
        </h1>
      </div>
      <div className="flex gap-4 mt-2 justify-center">
        <p className="text-gray-600">
          Filter updates by member, mood, or date.
        </p>
      </div>
      <div className="flex gap-4 mt-4 justify-center">
        <MemberFilter
          members={members}
          filter={memberFilter}
          setFilter={setMemberFilter}
        />
        <MoodFilter filter={moodFilter} setFilter={setMoodFilter} />
        <DateFilter filter={dateFilter} setFilter={setDateFilter} />
      </div>
      <ul className="bg-white shadow overflow-hidden sm:rounded-md max-w-sm mx-auto mt-4">
        {updates.map((update: Update) => (
          <UpdateCard key={update.id} update={update} />
        ))}
      </ul>
    </div>
  );
};

export default Updates;
