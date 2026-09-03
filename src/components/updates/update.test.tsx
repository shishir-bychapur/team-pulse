import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import UpdateCard from "./update";
import { Update, Mood } from "../../types/update";

jest.mock("../badge/badge", () => ({
  __esModule: true,
  default: ({ mood }: { mood: string }) => (
    <span data-testid="mock-badge">{mood}</span>
  ),
}));

describe("UpdateCard", () => {
  const mockUpdate: Update = {
    id: "1",
    text: "Completed the authentication module.",
    mood: Mood.GREEN,
    date: "2026-03-30",
    memberId: "1",
  };

  const mockMemberName = "Sarah Connor";

  it("renders member name and update content correctly", () => {
    render(<UpdateCard update={mockUpdate} memberName={mockMemberName} />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Sarah Connor" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Completed the authentication module."),
    ).toBeInTheDocument();
    expect(screen.getByText("2026-03-30")).toBeInTheDocument();
  });

  it("passes the correct mood prop to the Badge component", () => {
    render(<UpdateCard update={mockUpdate} memberName={mockMemberName} />);

    const badge = screen.getByTestId("mock-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(Mood.GREEN);
  });

  it("renders properly inside a list context", () => {
    const { container } = render(
      <ul>
        <UpdateCard update={mockUpdate} memberName={mockMemberName} />
      </ul>,
    );

    const listItem = container.querySelector("li");
    expect(listItem).toBeInTheDocument();
  });
});
