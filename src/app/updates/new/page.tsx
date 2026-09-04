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
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-semibold text-gray-900">
            Create an Update
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div>
              <label
                htmlFor="member"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Member
              </label>

              <select
                id="member"
                {...register("memberId")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select a member</option>

                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>

              {errors.memberId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.memberId.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="text"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Text
              </label>

              <input
                id="text"
                type="text"
                {...register("text")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {errors.text && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.text.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="mood"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Mood
              </label>

              <select
                id="mood"
                {...register("mood")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select a mood</option>

                {moods.map((mood) => (
                  <option key={mood} value={mood}>
                    {mood}
                  </option>
                ))}
              </select>

              {errors.mood && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mood.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Date
              </label>

              <input
                id="date"
                type="date"
                {...register("date")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {errors.date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="mt-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              Create Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
