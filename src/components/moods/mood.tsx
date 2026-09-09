import { Mood } from "@/generated/prisma/enums";
import { MoodBreakdownResult } from "@/src/types/update";

export default function MoodBreakdown({
  totalMoods,
  moodBreakdown,
}: {
  totalMoods: number;
  moodBreakdown: MoodBreakdownResult[];
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Mood distribution
        </h2>

        <p className="mt-1 text-sm text-gray-500">Overview of team moods.</p>
      </div>

      <div className="space-y-5 p-6">
        {[
          {
            mood: "Green",
            value:
              moodBreakdown.find((breakdown) => breakdown.mood === Mood.GREEN)
                ?._count.mood ?? 0,
            bg: "bg-green-500",
            lightBg: "bg-green-100",
          },
          {
            mood: "Yellow",
            value:
              moodBreakdown.find((breakdown) => breakdown.mood === Mood.YELLOW)
                ?._count.mood ?? 0,
            bg: "bg-yellow-400",
            lightBg: "bg-yellow-100",
          },
          {
            mood: "Red",
            value:
              moodBreakdown.find((breakdown) => breakdown.mood === Mood.RED)
                ?._count.mood ?? 0,
            bg: "bg-red-500",
            lightBg: "bg-red-100",
          },
        ].map(({ mood, value, bg, lightBg }) => {
          const percentage =
            totalMoods > 0 ? Math.round((value / totalMoods) * 100) : 0;

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

              <div className={`h-2.5 overflow-hidden rounded-full ${lightBg}`}>
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
  );
}
