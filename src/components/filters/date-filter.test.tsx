import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import DateFilter from "./date-filter";

jest.mock("../input/date", () => ({
  __esModule: true,
  default: ({
    date,
    setDate,
  }: {
    date: string;
    setDate: (date: string) => void;
  }) => (
    <input
      aria-label="Date input"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />
  ),
}));

describe("DateFilter", () => {
  it("renders the Date filter", () => {
    const setFilter = jest.fn();

    render(<DateFilter filter="" setFilter={setFilter} />);

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
    expect(screen.getByLabelText("Date input")).toBeInTheDocument();
  });

  it("passes the filter value to the Date input", () => {
    const setFilter = jest.fn();

    render(<DateFilter filter="2026-09-03" setFilter={setFilter} />);

    const dateInput = screen.getByLabelText("Date input");

    expect(dateInput).toHaveValue("2026-09-03");
  });

  it("resets the filter when Reset is clicked", () => {
    const setFilter = jest.fn();

    render(<DateFilter filter="2026-09-03" setFilter={setFilter} />);

    const resetButton = screen.getByRole("button", { name: "Reset" });

    fireEvent.click(resetButton);

    expect(setFilter).toHaveBeenCalledWith("");
  });

  it("renders the details element", () => {
    const setFilter = jest.fn();

    render(<DateFilter filter="" setFilter={setFilter} />);

    const details = screen.getByText("Date").closest("details");

    expect(details).toBeInTheDocument();
  });
});
