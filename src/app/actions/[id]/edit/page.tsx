"use client";

import { ActionForm, actionSchema } from "@/src/schema/action";
import { actionAPI } from "@/src/utils/apis/action";
import { memberAPI } from "@/src/utils/apis/member";
import { ActionItem } from "@/src/types/action";
import { ActionStatus } from "@/generated/prisma/enums";
import { MemberWithRole } from "@/src/types/member";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditAction() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const actionId = params.id;
  const [members, setMembers] = useState<MemberWithRole[]>([]);
  const [action, setAction] = useState<ActionItem | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await memberAPI.getAllMembers();
        setMembers(data.members);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const fetchAction = async () => {
      try {
        const data = await actionAPI.getSingleAction(actionId);
        setAction(data.action);
      } catch (error) {
        console.error("Error fetching action:", error);
      }
    };

    fetchAction();
  }, [actionId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActionForm>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      ownerId: "",
      title: "",
      dueDate: "",
      status: undefined,
    },
    values: {
      ownerId: action?.ownerId ?? "",
      title: action?.title ?? "",
      dueDate: action?.dueDate ?? "",
      status: action?.status ?? ActionStatus.OPEN,
    },
  });

  const onSubmit = async (data: ActionForm) => {
    try {
      const response = await actionAPI.editAction(actionId, data);

      if (response.ok) {
        toast.success("Successfully edited the action!");
        router.push(`/actions/${actionId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error editing the action!");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Edit an Action
          </h1>
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
                Edit Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
