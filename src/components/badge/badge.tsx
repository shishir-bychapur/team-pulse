import { Mood } from "../../types/update";

export default function Badge({ mood }: { mood: Mood }) {
  if (mood === Mood.RED) {
    return (
      <span className="inline-flex items-center rounded-md bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 inset-ring inset-ring-red-400/20">
        {mood}
      </span>
    );
  } else if (mood === Mood.YELLOW) {
    return (
      <span className="inline-flex items-center rounded-md bg-yellow-400/10 px-2 py-1 text-xs font-medium text-yellow-500 inset-ring inset-ring-yellow-400/20">
        {mood}
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center rounded-md bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 inset-ring inset-ring-green-500/20">
        {mood}
      </span>
    );
  }
}
