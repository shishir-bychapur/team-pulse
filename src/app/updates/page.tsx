import MoodFilter from "@/src/components/filters/mood-filter";
import DateFilter from "@/src/components/filters/date-filter";
import UpdateCard from "@/src/components/updates/update";
import { Update } from "@/src/types/update";
import MemberFilter from "@/src/components/filters/member-filter";

const Updates = async () => {
  const response = await fetch(process.env.URL + "/api/updates");
  const data: { updates: Update[] } = await response.json();

  return (
    <div className="mx-2">
      <div className="flex gap-4 mt-4 justify-center">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight">
          Updates
        </h1>
      </div>
      <div className="flex gap-4 mt-2 justify-center">
        <p className="text-gray-600">
          Filter updates by member, mood, or date.
        </p>
      </div>
      <div className="flex gap-4 mt-4 justify-center">
        <MemberFilter />
        <MoodFilter />
        <DateFilter />
      </div>
      <ul className="bg-white shadow overflow-hidden sm:rounded-md max-w-sm mx-auto mt-4">
        {data.updates.map((update: Update) => (
          <UpdateCard key={update.id} update={update} />
        ))}
      </ul>
    </div>
  );
};

export default Updates;
