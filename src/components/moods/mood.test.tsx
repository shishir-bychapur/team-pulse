import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MoodBreakdown from "./mood";
import { Mood } from "@/generated/prisma/enums";
import { MoodBreakdownResult } from "@/src/types/update";

describe("MoodBreakdown", () => {
  const mockMoodBreakdown: MoodBreakdownResult[] = [
    {
      mood: Mood.GREEN,
      _count: {
        mood: 5,
      },
    },
    {
      mood: Mood.YELLOW,
      _count: {
        mood: 3,
      },
    },
    {
      mood: Mood.RED,
      _count: {
        mood: 2,
      },
    },
  ];

  it("renders the title and description", () => {
    render(<MoodBreakdown totalMoods={10} moodBreakdown={mockMoodBreakdown} />);

    expect(screen.getByText("Mood distribution")).toBeInTheDocument();

    expect(screen.getByText("Overview of team moods.")).toBeInTheDocument();
  });

  it("renders all mood labels", () => {
    render(<MoodBreakdown totalMoods={10} moodBreakdown={mockMoodBreakdown} />);

    expect(screen.getByText("Green")).toBeInTheDocument();
    expect(screen.getByText("Yellow")).toBeInTheDocument();
    expect(screen.getByText("Red")).toBeInTheDocument();
  });

  it("renders the correct mood counts and percentages", () => {
    render(<MoodBreakdown totalMoods={10} moodBreakdown={mockMoodBreakdown} />);

    expect(screen.getByText("5 (50%)")).toBeInTheDocument();
    expect(screen.getByText("3 (30%)")).toBeInTheDocument();
    expect(screen.getByText("2 (20%)")).toBeInTheDocument();
  });

  it("renders zero for moods that are missing from the breakdown", () => {
    const partialMoodBreakdown: MoodBreakdownResult[] = [
      {
        mood: Mood.GREEN,
        _count: {
          mood: 5,
        },
      },
    ];

    render(
      <MoodBreakdown totalMoods={5} moodBreakdown={partialMoodBreakdown} />,
    );

    expect(screen.getByText("5 (100%)")).toBeInTheDocument();

    expect(screen.getAllByText("0 (0%)")).toHaveLength(2);
  });

  it("renders zero percentages when totalMoods is zero", () => {
    const moodBreakdown: MoodBreakdownResult[] = [
      {
        mood: Mood.GREEN,
        _count: {
          mood: 0,
        },
      },
      {
        mood: Mood.YELLOW,
        _count: {
          mood: 0,
        },
      },
      {
        mood: Mood.RED,
        _count: {
          mood: 0,
        },
      },
    ];

    render(<MoodBreakdown totalMoods={0} moodBreakdown={moodBreakdown} />);

    expect(screen.getAllByText("0 (0%)")).toHaveLength(3);
  });

  it("rounds percentages correctly", () => {
    const moodBreakdown: MoodBreakdownResult[] = [
      {
        mood: Mood.GREEN,
        _count: {
          mood: 1,
        },
      },
      {
        mood: Mood.YELLOW,
        _count: {
          mood: 1,
        },
      },
      {
        mood: Mood.RED,
        _count: {
          mood: 1,
        },
      },
    ];

    render(<MoodBreakdown totalMoods={3} moodBreakdown={moodBreakdown} />);

    expect(screen.getAllByText("1 (33%)")).toHaveLength(3);
  });
});
