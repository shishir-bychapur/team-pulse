"use client";

import { useState, useEffect } from "react";
import { Member } from "../../types/member";
import Link from "next/link";
import { ActionItem } from "@/src/types/action";
import ActionCard from "@/src/components/actions/action";

const Actions = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);

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
    const fetchActions = async () => {
      try {
        const response = await fetch("/api/actions");
        const data: { actions: ActionItem[] } = await response.json();
        setActions(data.actions);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchActions();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Actions
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Keep track of your team{"'"}s actions.
            </p>
          </div>

          <Link
            href="/actions/new"
            className="inline-flex w-fit items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Create Action
          </Link>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent actions
          </h2>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {actions.length} {actions.length === 1 ? "action" : "actions"}
          </span>
        </div>

        {actions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
              -
            </div>

            <h3 className="text-sm font-semibold text-gray-900">
              No actions found
            </h3>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {actions.map((action: ActionItem) => (
              <ActionCard
                key={action.id}
                action={action}
                memberName={
                  members.find((m) => m.id === action.ownerId)?.name || ""
                }
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default Actions;
