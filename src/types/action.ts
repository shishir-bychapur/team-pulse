export enum ActionStatus {
  OPEN = "Open",
  CLOSED = "Closed",
}

export interface ActionItem {
  id: string;
  title: string;
  ownerId: string;
  status: ActionStatus;
  dueDate: string;
}
