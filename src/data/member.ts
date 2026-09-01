import { Role, Member } from "../types/member";

const roles: Role[] = [
  {
    id: "1",
    name: "Developer",
  },
  {
    id: "2",
    name: "Designer",
  },
  {
    id: "3",
    name: "Manager",
  },
];

export const members: Member[] = [
  {
    id: "1",
    name: "Tom",
    role: roles[0],
    timezone: "UTC",
  },
  {
    id: "2",
    name: "Harry",
    role: roles[1],
    timezone: "UTC",
  },
  {
    id: "3",
    name: "Dominic",
    role: roles[2],
    timezone: "UTC",
  },
  {
    id: "4",
    name: "Paul",
    role: roles[0],
    timezone: "UTC",
  },
  {
    id: "5",
    name: "Joel",
    role: roles[2],
    timezone: "UTC",
  },
];
