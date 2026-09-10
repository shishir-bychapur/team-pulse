import { Member } from "@/generated/prisma/client";

export const members: Member[] = [
  {
    id: "1",
    name: "Tom",
    timezone: "UTC",
    roleId: "1",
    email: "tom@team-pulse.com",
  },
  {
    id: "2",
    name: "Harry",
    timezone: "UTC",
    roleId: "2",
    email: "harry@team-pulse.com",
  },
  {
    id: "3",
    name: "Dominic",
    timezone: "UTC",
    roleId: "3",
    email: "dominic@team-pulse.com",
  },
  {
    id: "4",
    name: "Paul",
    timezone: "UTC",
    roleId: "1",
    email: "paul@team-pulse.com",
  },
  {
    id: "5",
    name: "Joel",
    timezone: "UTC",
    roleId: "3",
    email: "joel@team-pulse.com",
  },
];
