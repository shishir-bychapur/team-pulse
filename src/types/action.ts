import { Member } from "@/generated/prisma/client";
import { ActionStatus } from "@/generated/prisma/enums";

export interface ActionItem {
  id: string;
  title: string;
  ownerId: string;
  status: ActionStatus;
  dueDate: string;
}

export interface ActionItemWithOwner {
  id: string;
  title: string;
  ownerId: string;
  status: ActionStatus;
  dueDate: string;
  owner: Member;
}
