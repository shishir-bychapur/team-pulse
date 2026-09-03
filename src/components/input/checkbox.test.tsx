import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import CheckBox from "./checkbox";

describe("CheckBox Component", () => {
  const mockCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders unchecked when the id is not present in the filter array", () => {
    render(
      <CheckBox id="member-1" filter={["member-2"]} callback={mockCallback} />,
    );

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;

    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(false);
    expect(checkbox.id).toBe("member-1");
  });

  it("renders checked when the id is present in the filter array", () => {
    render(
      <CheckBox
        id="member-1"
        filter={["member-1", "member-2"]}
        callback={mockCallback}
      />,
    );

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;

    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(true);
  });

  it("calls callback with (true, id) when toggling an already-checked checkbox", () => {
    render(
      <CheckBox id="member-1" filter={["member-1"]} callback={mockCallback} />,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(true, "member-1");
  });

  it("calls callback with (false, id) when toggling an unchecked checkbox", () => {
    render(<CheckBox id="member-1" filter={[]} callback={mockCallback} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(false, "member-1");
  });
});
