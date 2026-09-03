import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import DateInput from "./date";

describe("Date Component", () => {
  it("renders the date input with the initial date value", () => {
    const setDate = jest.fn();
    const initialDate = "2026-09-03";

    render(<DateInput date={initialDate} setDate={setDate} />);

    const dateInput = screen.getByLabelText("Date") as HTMLInputElement;

    expect(dateInput).toBeInTheDocument();
    expect(dateInput.type).toBe("date");
    expect(dateInput.value).toBe(initialDate);
  });

  it("calls setDate with the new date when changed", () => {
    const setDate = jest.fn();

    render(<DateInput date="" setDate={setDate} />);

    const dateInput = screen.getByLabelText("Date");
    const newDate = "2026-10-15";

    fireEvent.change(dateInput, { target: { value: newDate } });

    expect(setDate).toHaveBeenCalledTimes(1);
    expect(setDate).toHaveBeenCalledWith(newDate);
  });
});
