import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Actions from "./page";
import { actionAPI } from "@/src/utils/apis/action";
import { ActionStatus } from "@/generated/prisma/enums";

jest.mock("@/src/utils/apis/action", () => ({
  actionAPI: {
    getAllActions: jest.fn(),
  },
}));

jest.mock("@/src/components/actions/action", () => ({
  __esModule: true,
  default: ({
    action,
    memberName,
  }: {
    action: { id: string; title: string };
    memberName: string;
  }) => (
    <div data-testid={`action-card-${action.id}`}>
      <span>{action.title}</span>
      <span>{memberName}</span>
    </div>
  ),
}));

const mockedActionAPI = actionAPI as jest.Mocked<typeof actionAPI>;

const mockActions = [
  {
    id: "action-1",
    title: "Complete documentation",
    ownerId: "member-1",
    status: ActionStatus.OPEN,
    dueDate: "2026-09-10",
    owner: {
      id: "member-1",
      name: "John Doe",
      role: { id: "1", name: "developer" },
      timezone: "utc",
      roleId: "1",
      email: "john@email.com",
    },
  },
  {
    id: "action-2",
    title: "Review pull request",
    ownerId: "member-2",
    status: ActionStatus.CLOSED,
    dueDate: "2026-09-15",
    owner: {
      id: "member-2",
      name: "Jane Smith",
      role: { id: "2", name: "manager" },
      timezone: "utc",
      roleId: "2",
      email: "jane@email.com",
    },
  },
];

describe("Actions Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedActionAPI.getAllActions.mockResolvedValue({
      actions: mockActions,
    });
  });

  it("renders the actions page", async () => {
    render(<Actions />);

    expect(
      screen.getByRole("heading", { name: "Actions" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Keep track of your team's actions."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /\+ Create Action/i }),
    ).toHaveAttribute("href", "/actions/new");

    await waitFor(() => {
      expect(mockedActionAPI.getAllActions).toHaveBeenCalledTimes(1);
    });
  });

  it("renders the fetched actions", async () => {
    render(<Actions />);

    expect(
      await screen.findByTestId("action-card-action-1"),
    ).toBeInTheDocument();

    expect(screen.getByTestId("action-card-action-2")).toBeInTheDocument();

    expect(screen.getByText("Complete documentation")).toBeInTheDocument();

    expect(screen.getByText("Review pull request")).toBeInTheDocument();
  });

  it("displays the correct action count", async () => {
    render(<Actions />);

    await waitFor(() => {
      expect(screen.getByText("2 actions")).toBeInTheDocument();
    });
  });

  it("passes the correct member name to each action card", async () => {
    render(<Actions />);

    const firstActionCard = await screen.findByTestId("action-card-action-1");

    const secondActionCard = screen.getByTestId("action-card-action-2");

    expect(firstActionCard).toHaveTextContent("John Doe");
    expect(secondActionCard).toHaveTextContent("Jane Smith");
  });

  it("shows the empty state when there are no actions", async () => {
    mockedActionAPI.getAllActions.mockResolvedValue({
      actions: [],
    });

    render(<Actions />);

    expect(await screen.findByText("No actions found")).toBeInTheDocument();

    expect(screen.getByText("0 actions")).toBeInTheDocument();
  });

  it("displays singular action text when there is one action", async () => {
    mockedActionAPI.getAllActions.mockResolvedValue({
      actions: [mockActions[0]],
    });

    render(<Actions />);

    expect(await screen.findByText("1 action")).toBeInTheDocument();
  });

  it("handles action API errors", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockedActionAPI.getAllActions.mockRejectedValue(
      new Error("Failed to fetch actions"),
    );

    render(<Actions />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
