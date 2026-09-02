import { ChangeEvent, Dispatch, SetStateAction } from "react";

export default function Date({
  date,
  setDate,
}: {
  date: string;
  setDate: Dispatch<SetStateAction<string>>;
}) {
  return (
    <label htmlFor="date">
      <span className="text-sm text-gray-700">Date</span>
      <input
        type="date"
        id="date-filter"
        value={date}
        className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
        onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
      />
    </label>
  );
}
