import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ActionStatus } from "@/generated/prisma/enums";
import { ActionItem } from "@/src/types/action";
import ActionCard from "./action";

const mockAction: ActionItem = {
  id: "action-123",
  ownerId: "member-123",
  title: "Complete project documentation",
  status: ActionStatus.OPEN,
  dueDate: "2026-09-15",
};

describe("ActionCard", () => {
  const memberName = "Alice Johnson";

  it("renders the action details", () => {
    render(<ActionCard action={mockAction} memberName={memberName} />);

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();

    expect(screen.getByText("Due 2026-09-15")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Complete project documentation",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Action item")).toBeInTheDocument();
  });

  it("renders Open status when the action is open", () => {
    render(<ActionCard action={mockAction} memberName={memberName} />);

    expect(screen.getByText("Open")).toBeInTheDocument();

    expect(screen.queryByText("Closed")).not.toBeInTheDocument();
  });

  it("renders Closed status when the action is closed", () => {
    const closedAction: ActionItem = {
      ...mockAction,
      status: ActionStatus.CLOSED,
    };

    render(<ActionCard action={closedAction} memberName={memberName} />);

    expect(screen.getByText("Closed")).toBeInTheDocument();

    expect(screen.queryByText("Open")).not.toBeInTheDocument();
  });

  it("renders a link to the action details page", () => {
    render(<ActionCard action={mockAction} memberName={memberName} />);

    const link = screen.getByRole("link", {
      name: /view details/i,
    });

    expect(link).toBeInTheDocument();

    expect(link).toHaveAttribute("href", "/actions/action-123");
  });
});
