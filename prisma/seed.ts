import { PrismaClient, Mood, ActionStatus } from "../generated/prisma/client";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./prisma/dev.db",
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Starting database seed...");

  // =========================
  // ROLES
  // =========================

  await prisma.role.createMany({
    data: [
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
    ],
  });

  // =========================
  // MEMBERS
  // =========================

  await prisma.member.createMany({
    data: [
      {
        id: "1",
        name: "Tom",
        roleId: "1",
        timezone: "UTC",
      },
      {
        id: "2",
        name: "Harry",
        roleId: "2",
        timezone: "UTC",
      },
      {
        id: "3",
        name: "Dominic",
        roleId: "3",
        timezone: "UTC",
      },
      {
        id: "4",
        name: "Paul",
        roleId: "1",
        timezone: "UTC",
      },
      {
        id: "5",
        name: "Joel",
        roleId: "3",
        timezone: "UTC",
      },
    ],
  });

  // =========================
  // UPDATES
  // =========================

  await prisma.update.createMany({
    data: [
      {
        id: "1",
        memberId: "1",
        date: "2026-09-01",
        text: "Completed the new feature implementation.",
        mood: Mood.GREEN,
      },
      {
        id: "2",
        memberId: "2",
        date: "2026-09-02",
        text: "Faced some challenges with the design.",
        mood: Mood.YELLOW,
      },
      {
        id: "3",
        memberId: "3",
        date: "2026-09-03",
        text: "Had a productive meeting with the team.",
        mood: Mood.GREEN,
      },
      {
        id: "4",
        memberId: "1",
        date: "2026-09-04",
        text: "Encountered a critical bug in the system.",
        mood: Mood.RED,
      },
      {
        id: "5",
        memberId: "1",
        date: "2026-09-05",
        text: "Successfully resolved the bug.",
        mood: Mood.GREEN,
      },
    ],
  });

  // =========================
  // ACTION ITEMS
  // =========================

  await prisma.actionItem.createMany({
    data: [
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
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
