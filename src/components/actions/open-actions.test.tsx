import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import OpenActions from "./open-actions";

describe("OpenActions", () => {
  it("renders the title", () => {
    render(<OpenActions count={5} />);

    expect(screen.getByText("Open actions")).toBeInTheDocument();
  });

  it("renders the provided count", () => {
    render(<OpenActions count={5} />);

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<OpenActions count={5} />);

    expect(
      screen.getByText("Actions that still need attention"),
    ).toBeInTheDocument();
  });

  it("renders zero correctly", () => {
    render(<OpenActions count={0} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders different counts correctly", () => {
    render(<OpenActions count={12} />);

    expect(screen.getByText("12")).toBeInTheDocument();
  });
});
