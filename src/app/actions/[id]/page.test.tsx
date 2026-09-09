import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ActionPage from "./page";
import { ActionStatus } from "@/generated/prisma/enums";
import { notFound } from "next/navigation";
import { actionService } from "@/src/services/action";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@/src/services/action", () => ({
  actionService: {
    getAction: jest.fn(),
  },
}));

const mockedActionService = actionService as jest.Mocked<typeof actionService>;

const mockedNotFound = notFound as jest.MockedFunction<typeof notFound>;

const mockAction = {
  id: "action-1",
  title: "Complete project documentation",
  ownerId: "member-1",
  status: ActionStatus.OPEN,
  dueDate: "2026-09-15",
  owner: {
    id: "member-1",
    name: "John Doe",
    email: "john@email.com",
    timezone: "UTC",
    roleId: "role-1",
    role: {
      id: "role-1",
      name: "Developer",
    },
  },
};

describe("ActionPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedActionService.getAction.mockResolvedValue(mockAction);
  });

  it("fetches the action using the ID from params", async () => {
    const component = await ActionPage({
      params: Promise.resolve({
        id: "action-1",
      }),
    });

    render(component);

    expect(mockedActionService.getAction).toHaveBeenCalledWith("action-1");
  });

  it("renders the action title", async () => {
    const component = await ActionPage({
      params: Promise.resolve({
        id: "action-1",
      }),
    });

    render(component);

    expect(
      screen.getByRole("heading", {
        name: "Complete project documentation",
      }),
    ).toBeInTheDocument();
  });

  it("renders the Open status", async () => {
    const component = await ActionPage({
      params: Promise.resolve({
        id: "action-1",
      }),
    });

    render(component);

    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.queryByText("Closed")).not.toBeInTheDocument();
  });

  it("renders the Closed status when the action is closed", async () => {
    mockedActionService.getAction.mockResolvedValue({
      ...mockAction,
      status: ActionStatus.CLOSED,
    });

    const component = await ActionPage({
      params: Promise.resolve({
        id: "action-1",
      }),
    });

    render(component);

    expect(screen.getByText("Closed")).toBeInTheDocument();
    expect(screen.queryByText("Open")).not.toBeInTheDocument();
  });

  it("renders the action owner name", async () => {
    const component = await ActionPage({
      params: Promise.resolve({
        id: "action-1",
      }),
    });

    render(component);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders the due date", async () => {
    const component = await ActionPage({
      params: Promise.resolve({
        id: "action-1",
      }),
    });

    render(component);

    expect(screen.getByText("2026-09-15")).toBeInTheDocument();
  });

  it("renders the action ID", async () => {
    const component = await ActionPage({
      params: Promise.resolve({
        id: "action-1",
      }),
    });

    render(component);

    expect(screen.getByText("action-1")).toBeInTheDocument();
  });

  it("renders the back to actions link", async () => {
    const component = await ActionPage({
      params: Promise.resolve({
        id: "action-1",
      }),
    });

    render(component);

    const backLink = screen.getByRole("link", {
      name: /back to actions/i,
    });

    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/actions");
  });

  it("renders the edit action link with the correct ID", async () => {
    const component = await ActionPage({
      params: Promise.resolve({
        id: "action-1",
      }),
    });

    render(component);

    const links = screen.getAllByRole("link");

    const editLink = links.find(
      (link) => link.getAttribute("href") === "/actions/action-1/edit",
    );

    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute("href", "/actions/action-1/edit");
  });

  it("calls notFound when the action does not exist", async () => {
    mockedActionService.getAction.mockResolvedValue(null);

    mockedNotFound.mockImplementation(() => {
      throw new Error("NEXT_NOT_FOUND");
    });

    await expect(
      ActionPage({
        params: Promise.resolve({
          id: "action-1",
        }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockedActionService.getAction).toHaveBeenCalledWith("action-1");
    expect(mockedNotFound).toHaveBeenCalledTimes(1);
  });

  it("throws when actionService encounters an error", async () => {
    mockedActionService.getAction.mockRejectedValue(
      new Error("Network Error!"),
    );

    await expect(
      ActionPage({
        params: Promise.resolve({
          id: "action-1",
        }),
      }),
    ).rejects.toThrow("Network Error!");
  });
});
