import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Actions from "./page";

describe("Actions", () => {
  it("renders the actions page", () => {
    render(<Actions />);
    const title = screen.getByText("Actions");
    expect(title).toBeInTheDocument();
  });
});
