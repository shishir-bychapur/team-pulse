"use client";

import { moods } from "@/src/data/update";
import { UpdateForm, updateSchema } from "@/src/schema/update";
import { Member } from "@/src/types/member";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateUpdate() {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      memberId: "",
      text: "",
      date: "",
      mood: undefined,
    },
  });

  const onSubmit = async (data: UpdateForm) => {
    try {
      const response = await fetch("/api/updates/new", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        toast.success("Successfully created the update!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating a new update!");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create an Update
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Share an update about your progress, mood, or current work.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div>
              <label
                htmlFor="member"
                className="mb-2 block text-sm font-semibold text-gray-900"
              >
                Member
              </label>

              <select
                id="member"
                {...register("memberId")}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:ring-2 ${
                  errors.memberId
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
              >
                <option value="">Select a member</option>

                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role.name})
                  </option>
                ))}
              </select>

              {errors.memberId && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.memberId.message}
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="text"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Update
                </label>

                <span className="text-xs text-gray-400">
                  Share what&apos;s happening
                </span>
              </div>

              <textarea
                id="text"
                rows={5}
                placeholder="What are you working on? Any progress, blockers, or achievements?"
                {...register("text")}
                className={`w-full resize-y rounded-lg border bg-white px-3 py-3 text-sm leading-6 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                  errors.text
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />

              {errors.text && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.text.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="mood"
                className="mb-2 block text-sm font-semibold text-gray-900"
              >
                Mood
              </label>

              <select
                id="mood"
                {...register("mood")}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:ring-2 ${
                  errors.mood
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
              >
                <option value="">Select a mood</option>

                {moods.map((mood) => (
                  <option key={mood} value={mood}>
                    {mood}
                  </option>
                ))}
              </select>

              {errors.mood && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.mood.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-semibold text-gray-900"
              >
                Date
              </label>

              <input
                id="date"
                type="date"
                {...register("date")}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:ring-2 ${
                  errors.date
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />

              {errors.date && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
