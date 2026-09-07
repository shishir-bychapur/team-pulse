import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ActionPage from "./page";
import { actionAPI } from "@/src/apis/action";
import { memberAPI } from "@/src/apis/member";
import { ActionStatus } from "@/src/types/action";
import { notFound } from "next/navigation";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@/src/apis/action", () => ({
  actionAPI: {
    getSingleAction: jest.fn(),
  },
}));

jest.mock("@/src/apis/member", () => ({
  memberAPI: {
    getSingleMember: jest.fn(),
  },
}));

const mockedActionAPI = actionAPI as jest.Mocked<typeof actionAPI>;
const mockedMemberAPI = memberAPI as jest.Mocked<typeof memberAPI>;
const mockedNotFound = notFound as jest.MockedFunction<typeof notFound>;

const mockAction = {
  id: "action-1",
  title: "Complete project documentation",
  ownerId: "member-1",
  status: ActionStatus.OPEN,
  dueDate: "2026-09-15",
};

const mockMember = {
  id: "member-1",
  name: "John Doe",
  role: {
    id: "role-1",
    name: "Developer",
  },
  timezone: "utc"
};

describe("ActionPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedActionAPI.getSingleAction.mockResolvedValue({
      action: mockAction,
    });

    mockedMemberAPI.getSingleMember.mockResolvedValue({
      member: mockMember,
    });
  });

  it("fetches the action using the ID from params", async () => {
    const component = await ActionPage({
      params: Promise.resolve({
        id: "action-1",
      }),
    });

    render(component);

    expect(mockedActionAPI.getSingleAction).toHaveBeenCalledWith("action-1");
  });

  it("fetches the owner using the action ownerId", async () => {
    const component = await ActionPage({
      params: Promise.resolve({
        id: "action-1",
      }),
    });

    render(component);

    expect(mockedMemberAPI.getSingleMember).toHaveBeenCalledWith("member-1");
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

  it("renders the OPEN status", async () => {
    const component = await ActionPage({
      params: Promise.resolve({
        id: "action-1",
      }),
    });

    render(component);

    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("renders the CLOSED status when the action is closed", async () => {
    mockedActionAPI.getSingleAction.mockResolvedValue({
      action: {
        ...mockAction,
        status: ActionStatus.CLOSED,
      },
    });

    const component = await ActionPage({
      params: Promise.resolve({
        id: "action-1",
      }),
    });

    render(component);

    expect(screen.getByText("Closed")).toBeInTheDocument();
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

  it("renders Unknown when the member cannot be found", async () => {
    mockedMemberAPI.getSingleMember.mockResolvedValue({
      member: null,
    });

    const component = await ActionPage({
      params: Promise.resolve({
        id: "action-1",
      }),
    });

    render(component);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
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
    mockedActionAPI.getSingleAction.mockResolvedValue({
      action: null,
    });

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

    expect(mockedNotFound).toHaveBeenCalledTimes(1);

    expect(mockedMemberAPI.getSingleMember).not.toHaveBeenCalled();
  });
});
