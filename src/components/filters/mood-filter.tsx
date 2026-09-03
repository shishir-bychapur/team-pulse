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
      <summary className="flex items-center gap-2 border-b border-gray-300 pb-1 text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-medium">Mood</span>

        <span className="transition-transform group-open:-rotate-180">
          <svg
            aria-hidden="true"
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
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </summary>

      <div className="z-auto w-64 divide-y divide-gray-300 rounded border border-gray-300 bg-white shadow-sm group-open:absolute group-open:start-0 group-open:top-8">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm text-gray-700">
            {filter.length} Selected{" "}
          </span>

          <button
            type="button"
            className="cursor-pointer text-sm text-gray-700 underline transition-colors hover:text-gray-900"
            onClick={() => setFilter([])}
          >
            Reset
          </button>
        </div>

        <fieldset className="p-3">
          <legend className="sr-only">Checkboxes</legend>

          <div className="flex flex-col items-start gap-3">
            {moods.map((mood) => (
              <label
                key={mood}
                htmlFor={mood}
                className="inline-flex items-center gap-3"
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
