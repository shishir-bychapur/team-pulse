import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import MoodFilter from "./mood-filter";
import { Mood } from "../../types/update";

jest.mock("../input/checkbox", () => ({
  __esModule: true,
  default: ({
    id,
    filter,
    callback,
  }: {
    id: string;
    filter: string[];
    callback: (isChecked: boolean, id: string) => void;
  }) => (
    <input
      type="checkbox"
      aria-label={`checkbox-${id}`}
      checked={filter.includes(id)}
      onChange={(e) => callback(!e.target.checked, id)}
    />
  ),
}));

jest.mock("../badge/badge", () => ({
  __esModule: true,
  default: ({ mood }: { mood: string }) => (
    <span data-testid={`badge-${mood}`}>{mood}</span>
  ),
}));

describe("MoodFilter", () => {
  it("renders all mood options and badges", () => {
    const setFilter = jest.fn();

    render(<MoodFilter filter={[]} setFilter={setFilter} />);

    expect(screen.getByTestId(`badge-${Mood.RED}`)).toBeInTheDocument();
    expect(screen.getByTestId(`badge-${Mood.YELLOW}`)).toBeInTheDocument();
    expect(screen.getByTestId(`badge-${Mood.GREEN}`)).toBeInTheDocument();
  });

  it("displays the correct count of selected items", () => {
    const setFilter = jest.fn();

    render(
      <MoodFilter filter={[Mood.RED, Mood.GREEN]} setFilter={setFilter} />,
    );

    expect(screen.getByText("2", { selector: "span" })).toBeInTheDocument();
    expect(screen.getByText("2 selected")).toBeInTheDocument();
  });

  it("adds a mood to the filter when selecting an unchecked mood", () => {
    const setFilter = jest.fn();

    render(<MoodFilter filter={[]} setFilter={setFilter} />);

    const redCheckbox = screen.getByRole("checkbox", {
      name: `checkbox-${Mood.RED}`,
    });

    fireEvent.click(redCheckbox);

    expect(setFilter).toHaveBeenCalledWith([Mood.RED]);
  });

  it("removes a mood from the filter when deselecting a checked mood", () => {
    const setFilter = jest.fn();

    render(
      <MoodFilter filter={[Mood.RED, Mood.YELLOW]} setFilter={setFilter} />,
    );

    const redCheckbox = screen.getByRole("checkbox", {
      name: `checkbox-${Mood.RED}`,
    });

    fireEvent.click(redCheckbox);

    expect(setFilter).toHaveBeenCalledWith([Mood.YELLOW]);
  });

  it("resets the filter when the reset button is clicked", () => {
    const setFilter = jest.fn();

    render(
      <MoodFilter filter={[Mood.RED, Mood.YELLOW]} setFilter={setFilter} />,
    );

    const resetButton = screen.getByRole("button", { name: "Reset" });

    fireEvent.click(resetButton);

    expect(setFilter).toHaveBeenCalledWith([]);
  });
});
