import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Navbar from "./navbar";

describe("Navigation Bar", () => {
  const navItems = ["TeamPulse", "Members", "Actions", "Updates"];

  it("renders with the correct items", () => {
    render(<Navbar />);

    const appName = screen.getByText(navItems[0]);
    const links = screen.getAllByRole("link");

    expect(appName).toBeInTheDocument();
    expect(links).toHaveLength(navItems.length);
    expect(links[1]).toHaveTextContent("Members");
    expect(links[2]).toHaveTextContent("Actions");
    expect(links[3]).toHaveTextContent("Updates");
  });

  it("has the correct href for each link", () => {
    render(<Navbar />);

    const links = screen.getAllByRole("link");

    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[1]).toHaveAttribute("href", "/members");
    expect(links[2]).toHaveAttribute("href", "/actions");
    expect(links[3]).toHaveAttribute("href", "/updates");
  });
});
