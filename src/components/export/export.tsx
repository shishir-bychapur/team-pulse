"use client";
import { useState } from "react";

export default function Export() {
  const [selectedDate, setSelectedDate] = useState("2026-09-08");

  const exportCSV = () => {};

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

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-lg font-semibold text-gray-900">Export updates</h2>

        <p className="mt-1 text-sm text-gray-500">
          Download all updates for a specific date as a CSV file.
        </p>
      </div>

      <div className="p-6">
        <div>
          <label
            htmlFor="export-date"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Select date
          </label>

          <input
            id="export-date"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg
            className="size-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5v-9.75m0 9.75L8.25 12.75M12 16.5l3.75-3.75M3 17.25v1.125c0 .621.504 1.125 1.125 1.125h15.75c.621 0 1.125-.504 1.125-1.125V17.25"
            />
          </svg>
          Export CSV
        </button>

        <p className="mt-3 text-center text-xs text-gray-400">
          Only updates matching the selected date will be exported.
        </p>
      </div>
    </section>
  );
}
