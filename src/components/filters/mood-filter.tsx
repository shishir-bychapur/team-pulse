"use client";

import { Mood } from "../../types/update";
import { Dispatch, SetStateAction } from "react";
import CheckBox from "../input/checkbox";
import Badge from "../badge/badge";

export default function MoodFilter({
  filter,
  setFilter,
}: {
  filter: string[];
  setFilter: Dispatch<SetStateAction<string[]>>;
}) {
  const moods = [Mood.RED, Mood.YELLOW, Mood.GREEN];

  const callback = (isChecked: boolean, mood: string) => {
    if (isChecked) {
      setFilter([...filter].filter((m) => m !== mood));
    } else {
      setFilter([...filter, mood]);
    }
  };

  return (
    <details className="group relative">
      <summary
        className={`flex cursor-pointer list-none items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-sm transition-all [&::-webkit-details-marker]:hidden ${
          filter.length > 0
            ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4"
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

        <span>Mood</span>

        {filter.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
            {filter.length}
          </span>
        )}

        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="ml-1 size-4 transition-transform group-open:rotate-180"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </summary>

      <div className="absolute start-0 top-12 z-20 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Mood</p>
            <p className="text-xs text-gray-500">
              {filter.length === 0 ? "All moods" : `${filter.length} selected`}
            </p>
          </div>

          {filter.length > 0 && (
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setFilter([])}
            >
              Reset
            </button>
          )}
        </div>

        <fieldset className="p-2">
          <legend className="sr-only">Moods</legend>

          <div className="flex flex-col gap-1">
            {moods.map((mood) => (
              <label
                key={mood}
                htmlFor={mood}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
              >
                <CheckBox filter={filter} id={mood} callback={callback} />

                <Badge mood={mood} />
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </details>
  );
}
