import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CreateAction from "./page";
import { ActionStatus } from "@/generated/prisma/enums";
import { toast } from "sonner";
import { memberAPI } from "@/src/utils/apis/member";
import { actionAPI } from "@/src/utils/apis/action";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/src/utils/apis/member", () => ({
  memberAPI: {
    getAllMembers: jest.fn(),
  },
}));

jest.mock("@/src/utils/apis/action", () => ({
  actionAPI: {
    createAction: jest.fn(),
  },
}));

const mockedMemberAPI = memberAPI as jest.Mocked<typeof memberAPI>;
const mockedActionAPI = actionAPI as jest.Mocked<typeof actionAPI>;

const mockMembers = [
  {
    id: "member-1",
    name: "John Doe",
    role: {
      id: "role-1",
      name: "Developer",
    },
    timezone: "utc",
    roleId: "role-1",
    email: "john@email.com",
  },
  {
    id: "member-2",
    name: "Jane Smith",
    role: {
      id: "role-2",
      name: "Designer",
    },
    timezone: "utc",
    roleId: "role-2",
    email: "jane@email.com",
  },
];

const renderPage = async () => {
  render(<CreateAction />);

  await waitFor(() => {
    expect(
      screen.getByRole("option", {
        name: "John Doe (Developer)",
      }),
    ).toBeInTheDocument();
  });
};

describe("CreateAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedMemberAPI.getAllMembers.mockResolvedValue({
      members: mockMembers,
    });
  });

  it("renders the create action form", async () => {
    await renderPage();

    expect(
      screen.getByRole("heading", {
        name: /create an action/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/share a pending task or a completed action item/i),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/owner/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/^title$/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /create update/i,
      }),
    ).toBeInTheDocument();
  });

  it("fetches and displays members", async () => {
    await renderPage();

    expect(mockedMemberAPI.getAllMembers).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole("option", {
        name: "John Doe (Developer)",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Jane Smith (Designer)",
      }),
    ).toBeInTheDocument();
  });

  it("successfully creates an action and redirects", async () => {
    const mockJson = jest.fn().mockResolvedValue({
      id: "new-action-1",
    });

    mockedActionAPI.createAction.mockResolvedValue({
      ok: true,
      json: mockJson,
    } as unknown as Response);

    await renderPage();

    fireEvent.change(screen.getByLabelText(/owner/i), {
      target: { value: "member-1" },
    });

    fireEvent.change(screen.getByLabelText(/^title$/i), {
      target: { value: "Complete project documentation" },
    });

    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: ActionStatus.OPEN },
    });

    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: "2026-10-01" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /create update/i,
      }),
    );

    await waitFor(() => {
      expect(mockedActionAPI.createAction).toHaveBeenCalledWith({
        ownerId: "member-1",
        title: "Complete project documentation",
        status: ActionStatus.OPEN,
        dueDate: "2026-10-01",
      });
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Successfully created the action!",
      );
    });

    expect(mockJson).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/actions/new-action-1");
    });
  });

  it("shows an error toast when creating an action fails", async () => {
    const error = new Error("Failed to create action");

    mockedActionAPI.createAction.mockRejectedValue(error);

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await renderPage();

    fireEvent.change(screen.getByLabelText(/owner/i), {
      target: { value: "member-1" },
    });

    fireEvent.change(screen.getByLabelText(/^title$/i), {
      target: { value: "Complete project documentation" },
    });

    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: ActionStatus.OPEN },
    });

    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: "2026-10-01" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /create update/i,
      }),
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error creating a new action!");
    });

    expect(mockPush).not.toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it("does not submit when required fields are missing", async () => {
    await renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: /create update/i,
      }),
    );

    await waitFor(() => {
      expect(mockedActionAPI.createAction).not.toHaveBeenCalled();
    });
  });

  it("does not submit when some fields are missing", async () => {
    await renderPage();

    fireEvent.change(screen.getByLabelText(/owner/i), {
      target: { value: "member-1" },
    });

    fireEvent.change(screen.getByLabelText(/^title$/i), {
      target: { value: "Complete project documentation" },
    });

    // Leave status and due date empty

    fireEvent.click(
      screen.getByRole("button", {
        name: /create update/i,
      }),
    );

    await waitFor(() => {
      expect(mockedActionAPI.createAction).not.toHaveBeenCalled();
    });
  });

  it("does not submit when title is missing", async () => {
    await renderPage();

    fireEvent.change(screen.getByLabelText(/owner/i), {
      target: { value: "member-1" },
    });

    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: ActionStatus.OPEN },
    });

    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: "2026-10-01" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /create update/i,
      }),
    );

    await waitFor(() => {
      expect(mockedActionAPI.createAction).not.toHaveBeenCalled();
    });
  });

  it("handles an error when fetching members", async () => {
    const error = new Error("Failed to fetch members");

    mockedMemberAPI.getAllMembers.mockRejectedValue(error);

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<CreateAction />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error fetching members:",
        error,
      );
    });

    consoleError.mockRestore();
  });
});
