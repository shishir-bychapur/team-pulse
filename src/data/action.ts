import { ActionItem, ActionStatus } from "../types/action-item";

export const actionItems: ActionItem[] = [
  {
    id: "act-101",
    title: "Setup CI/CD pipeline",
    ownerId: "1",
    status: ActionStatus.OPEN,
    dueDate: "2026-09-15",
  },
  {
    id: "act-102",
    title: "Design main dashboard wireframes",
    ownerId: "2",
    status: ActionStatus.OPEN,
    dueDate: "2026-09-10",
  },
  {
    id: "act-103",
    title: "Conduct Q3 sprint planning",
    ownerId: "3",
    status: ActionStatus.CLOSED,
    dueDate: "2026-08-30",
  },
  {
    id: "act-104",
    title: "Fix authentication token refresh bug",
    ownerId: "4",
    status: ActionStatus.OPEN,
    dueDate: "2026-09-08",
  },
  {
    id: "act-105",
    title: "Review Q4 budget allocation",
    ownerId: "5",
    status: ActionStatus.CLOSED,
    dueDate: "2026-08-25",
  },
  {
    id: "act-106",
    title: "Update component library documentation",
    ownerId: "2",
    status: ActionStatus.OPEN,
    dueDate: "2026-09-20",
  },
];
