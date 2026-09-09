import Export from "../components/export/export";
import { actionService } from "../services/action";
import { ActionStatus } from "@/generated/prisma/enums";
import { updateService } from "../services/update";
import { dateFormat } from "../utils/date";
import MoodBreakdown from "../components/moods/mood";
import OpenActions from "../components/actions/open-actions";
import UpdatesToday from "../components/updates/updates-today";

export default async function Dashboard() {
  const openActions = await actionService.getActionsByStatus(ActionStatus.OPEN);
  const moodBreakdown = await updateService.getMoodBreakdown();
  const updatesToday = await updateService.getUpdates([], [], dateFormat());
  const totalMoods = moodBreakdown.reduce(
    (total, current) => total + current._count.mood,
    0,
  );

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

        <div className="grid gap-4 sm:grid-cols-2">
          <UpdatesToday count={updatesToday.length} />
          <OpenActions count={openActions} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <MoodBreakdown
            totalMoods={totalMoods}
            moodBreakdown={moodBreakdown}
          />
          <Export updates={updatesToday} />
        </div>
      </div>
    </main>
  );
}
