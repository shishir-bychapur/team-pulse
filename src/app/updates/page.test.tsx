import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Updates from "./page";

describe("Updates", () => {
  it("renders the update page", () => {
    render(<Updates />);
    const title = screen.getByText("Updates");
    expect(title).toBeInTheDocument();
  });
});
