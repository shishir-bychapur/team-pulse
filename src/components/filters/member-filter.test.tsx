import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import MemberFilter from "./member-filter";
import { members } from "../../data/member";

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

describe("MemberFilter", () => {
  it("renders the members", () => {
    const setFilter = jest.fn();

    render(
      <MemberFilter members={members} filter={[]} setFilter={setFilter} />,
    );

    expect(screen.getByText("Tom (Developer)")).toBeInTheDocument();
    expect(screen.getByText("Harry (Designer)")).toBeInTheDocument();
    expect(screen.getByText("Dominic (Manager)")).toBeInTheDocument();
    expect(screen.getByText("Paul (Developer)")).toBeInTheDocument();
    expect(screen.getByText("Joel (Manager)")).toBeInTheDocument();
  });

  it("displays the number of selected members", () => {
    const setFilter = jest.fn();

    render(
      <MemberFilter members={members} filter={["1"]} setFilter={setFilter} />,
    );

    expect(screen.getByText("1 Selected")).toBeInTheDocument();
  });

  it("adds a member to the filter when unchecked checkbox is selected", () => {
    const setFilter = jest.fn();

    render(
      <MemberFilter members={members} filter={[]} setFilter={setFilter} />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    expect(setFilter).toHaveBeenCalled();
  });

  it("removes a member from the filter when checked checkbox is unselected", () => {
    const setFilter = jest.fn();

    render(
      <MemberFilter
        members={members}
        filter={["1", "2"]}
        setFilter={setFilter}
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "checkbox-1" });
    fireEvent.click(checkbox);

    expect(setFilter).toHaveBeenCalledWith(["2"]);
  });

  it("resets the filter", () => {
    const setFilter = jest.fn();

    render(
      <MemberFilter
        members={members}
        filter={["1", "2"]}
        setFilter={setFilter}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(setFilter).toHaveBeenCalledWith([]);
  });
});
