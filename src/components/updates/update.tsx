import { Update } from "@/src/types/update";

export default function UpdateCard({ update }: { update: Update }) {
  return (
    <li className="mt-2 border border-gray-300 rounded-lg shadow-sm divide-y divide-gray-200">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {update.memberId}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{update.text}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">
            Mood:{" "}
            <span className={`text-${update.mood}-600`}>{update.mood}</span>
          </p>
          <p className="font-medium">{update.date}</p>
        </div>
      </div>
    </li>
  );
}
