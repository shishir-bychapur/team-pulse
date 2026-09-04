"use client";

import { ActionForm, actionSchema } from "@/src/schema/action";
import { ActionStatus } from "@/src/types/action";
import { Member } from "@/src/types/member";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateAction() {
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
  } = useForm<ActionForm>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      ownerId: "",
      title: "",
      dueDate: "",
      status: undefined,
    },
  });

  const onSubmit = async (data: ActionForm) => {
    try {
      const response = await fetch("/api/actions", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        toast.success("Successfully created the action!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating a new action!");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create an Action
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Share a pending task or a completed action item.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div>
              <label
                htmlFor="ownerId"
                className="mb-2 block text-sm font-semibold text-gray-900"
              >
                Owner
              </label>

              <select
                id="ownerId"
                {...register("ownerId")}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:ring-2 ${
                  errors.ownerId
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
              >
                <option value="">Select an owner</option>

                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role.name})
                  </option>
                ))}
              </select>

              {errors.ownerId && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.ownerId.message}
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Title
                </label>

                <span className="text-xs text-gray-400">
                  Share what&apos;s happening
                </span>
              </div>

              <textarea
                id="title"
                rows={5}
                placeholder="What is the action required to be done?"
                {...register("title")}
                className={`w-full resize-y rounded-lg border bg-white px-3 py-3 text-sm leading-6 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                  errors.title
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />

              {errors.title && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-semibold text-gray-900"
              >
                Status
              </label>

              <select
                id="status"
                {...register("status")}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:ring-2 ${
                  errors.status
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
              >
                <option value="">Select a status</option>
                <option value={ActionStatus.OPEN}>{ActionStatus.OPEN}</option>
                <option value={ActionStatus.CLOSED}>
                  {ActionStatus.CLOSED}
                </option>
              </select>

              {errors.status && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="due-date"
                className="mb-2 block text-sm font-semibold text-gray-900"
              >
                Due Date
              </label>

              <input
                id="due-date"
                type="date"
                {...register("dueDate")}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:ring-2 ${
                  errors.dueDate
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />

              {errors.dueDate && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.dueDate.message}
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
