import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Badge from "./badge";
import { Mood } from "../../types/update";

describe("Badge", () => {
  it("renders with the correct style for red mood", () => {
    render(<Badge mood={Mood.RED} />);

    const badge = screen.getByText(Mood.RED);

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-red-400");
    expect(badge).toHaveClass("bg-red-400/10");
  });

  it("renders with the correct style for yellow mood", () => {
    render(<Badge mood={Mood.YELLOW} />);

    const badge = screen.getByText(Mood.YELLOW);

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-yellow-500");
    expect(badge).toHaveClass("bg-yellow-400/10");
  });

  it("renders with the correct style for green mood", () => {
    render(<Badge mood={Mood.GREEN} />);

    const badge = screen.getByText(Mood.GREEN);

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-green-400");
    expect(badge).toHaveClass("bg-green-400/10");
  });
});
