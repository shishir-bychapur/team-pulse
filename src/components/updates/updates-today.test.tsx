import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import UpdatesToday from "./updates-today";

describe("UpdatesToday", () => {
  it("renders the component title and description", () => {
    render(<UpdatesToday count={5} />);

    expect(screen.getByText("Updates today")).toBeInTheDocument();

    expect(
      screen.getByText("Team updates submitted today"),
    ).toBeInTheDocument();
  });

  it("renders the correct update count", () => {
    render(<UpdatesToday count={5} />);

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders zero updates correctly", () => {
    render(<UpdatesToday count={0} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
