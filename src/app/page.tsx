import Export from "../components/export/export";
import { actionService } from "../services/action";
import { ActionStatus } from "@/generated/prisma/enums";
import { Mood } from "@/generated/prisma/enums";
// type Mood = "Red" | "Yellow" | "Green";

const mockUpdates = [
  {
    id: "1",
    memberName: "Alice Johnson",
    text: "Finished the dashboard implementation.",
    mood: "Green" as Mood,
    date: "2026-09-08",
  },
  {
    id: "2",
    memberName: "Tom Smith",
    text: "Working through a few API issues.",
    mood: "Yellow" as Mood,
    date: "2026-09-08",
  },
  {
    id: "3",
    memberName: "Harry Lee",
    text: "Blocked by an environment configuration issue.",
    mood: "Red" as Mood,
    date: "2026-09-08",
  },
  {
    id: "4",
    memberName: "Paul Brown",
    text: "Completed the action item assigned yesterday.",
    mood: "Green" as Mood,
    date: "2026-09-07",
  },
];

const mockActions = [
  {
    id: "1",
    title: "Fix authentication issue",
    status: "Open",
  },
  {
    id: "2",
    title: "Review dashboard design",
    status: "Open",
  },
  {
    id: "3",
    title: "Update API documentation",
    status: "Completed",
  },
];

export default async function Dashboard() {
  const today = "2026-09-08";

  const updatesToday = mockUpdates.filter(
    (update) => update.date === today,
  ).length;

  const openActions = await actionService.getActionsByStatus(ActionStatus.OPEN);

  console.log(openActions);

  const moodDistribution = {
    Red: mockUpdates.filter(
      (update) => update.date === today && update.mood === "RED",
    ).length,
    Yellow: mockUpdates.filter(
      (update) => update.date === today && update.mood === "YELLOW",
    ).length,
    Green: mockUpdates.filter(
      (update) => update.date === today && update.mood === "GREEN",
    ).length,
  };

  // const exportCSV = () => {
  //   const updatesForDate = mockUpdates.filter(
  //     (update) => update.date === selectedDate,
  //   );

  //   const headers = ["Member", "Update", "Mood", "Date"];

  //   const rows = updatesForDate.map((update) => [
  //     update.memberName,
  //     update.text,
  //     update.mood,
  //     update.date,
  //   ]);

  //   const csvContent = [
  //     headers.join(","),
  //     ...rows.map((row) =>
  //       row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","),
  //     ),
  //   ].join("\n");

  //   const blob = new Blob([csvContent], {
  //     type: "text/csv;charset=utf-8;",
  //   });

  //   const url = URL.createObjectURL(blob);

  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = `updates-${selectedDate}.csv`;

  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);

  //   URL.revokeObjectURL(url);
  // };

  const totalMoodUpdates =
    moodDistribution.Red + moodDistribution.Yellow + moodDistribution.Green;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Get a quick overview of your team&apos;s updates, actions, and
            overall mood.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Updates today
                </p>

                <p className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
                  {updatesToday}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Team updates submitted today
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50">
                <svg
                  className="size-5 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A3.375 3.375 0 0 0 11.25 11.625v2.625m8.25 0v3.375a3.375 3.375 0 0 1-3.375 3.375H7.875A3.375 3.375 0 0 1 4.5 17.625V14.25m15 0H4.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Open actions
                </p>

                <p className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
                  {openActions ?? 0}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Actions that still need attention
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-orange-50">
                <svg
                  className="size-5 text-orange-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Team mood</p>

                <p className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
                  {totalMoodUpdates}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Mood updates recorded today
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-purple-50">
                <svg
                  className="size-5 text-purple-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75h.008v.008H9.75V9.75Zm4.5 0h.008v.008h-.008V9.75Zm-4.5 6a3.75 3.75 0 0 0 4.5 0"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Mood distribution
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Overview of team moods for today.
              </p>
            </div>

            <div className="space-y-5 p-6">
              {[
                {
                  mood: "Green",
                  value: moodDistribution.Green,
                  bg: "bg-green-500",
                  lightBg: "bg-green-100",
                },
                {
                  mood: "Yellow",
                  value: moodDistribution.Yellow,
                  bg: "bg-yellow-400",
                  lightBg: "bg-yellow-100",
                },
                {
                  mood: "Red",
                  value: moodDistribution.Red,
                  bg: "bg-red-500",
                  lightBg: "bg-red-100",
                },
              ].map(({ mood, value, bg, lightBg }) => {
                const percentage =
                  totalMoodUpdates > 0
                    ? Math.round((value / totalMoodUpdates) * 100)
                    : 0;

                return (
                  <div key={mood}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`size-3 rounded-full ${bg}`} />

                        <span className="text-sm font-medium text-gray-700">
                          {mood}
                        </span>
                      </div>

                      <span className="text-sm font-semibold text-gray-900">
                        {value} ({percentage}%)
                      </span>
                    </div>

                    <div
                      className={`h-2.5 overflow-hidden rounded-full ${lightBg}`}
                    >
                      <div
                        className={`h-full rounded-full ${bg} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <Export />
        </div>
      </div>
    </main>
  );
}
