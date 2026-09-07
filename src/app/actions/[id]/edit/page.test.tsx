import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EditAction from "./page";
import { ActionStatus } from "@/src/types/action";
import { toast } from "sonner";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: jest.fn(() => ({
    id: "action-1",
  })),
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

jest.mock("@/src/services/member", () => ({
  memberAPI: {
    getAllMembers: jest.fn(),
  },
}));

jest.mock("@/src/services/action", () => ({
  actionAPI: {
    getSingleAction: jest.fn(),
    editAction: jest.fn(),
  },
}));

import { memberAPI } from "@/src/services/member";
import { actionAPI } from "@/src/services/action";

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
  },
  {
    id: "member-2",
    name: "Jane Smith",
    role: {
      id: "role-2",
      name: "Designer",
    },
    timezone: "utc",
  },
];

const mockAction = {
  id: "action-1",
  ownerId: "member-1",
  title: "Complete project documentation",
  status: ActionStatus.OPEN,
  dueDate: "2026-09-15",
};

const renderPage = async () => {
  render(<EditAction />);

  await waitFor(() => {
    expect(screen.getByLabelText(/^title$/i)).toHaveValue(mockAction.title);
  });

  await waitFor(() => {
    expect(
      screen.getByRole("option", {
        name: "John Doe (Developer)",
      }),
    ).toBeInTheDocument();
  });
};

describe("EditAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedMemberAPI.getAllMembers.mockResolvedValue({
      members: mockMembers,
    });

    mockedActionAPI.getSingleAction.mockResolvedValue({
      action: mockAction,
    });
  });

  it("renders the form with action data", async () => {
    await renderPage();

    expect(
      screen.getByRole("heading", {
        name: /edit an action/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/owner/i)).toHaveValue("member-1");

    expect(screen.getByLabelText(/^title$/i)).toHaveValue(
      "Complete project documentation",
    );

    expect(screen.getByLabelText(/status/i)).toHaveValue(ActionStatus.OPEN);

    expect(screen.getByLabelText(/due date/i)).toHaveValue("2026-09-15");
  });

  it("fetches members and action data", async () => {
    await renderPage();

    expect(mockedMemberAPI.getAllMembers).toHaveBeenCalledTimes(1);

    expect(mockedActionAPI.getSingleAction).toHaveBeenCalledWith("action-1");

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

  it("successfully edits an action", async () => {
    mockedActionAPI.editAction.mockResolvedValue({
      ok: true,
    } as Response);

    await renderPage();

    fireEvent.change(screen.getByLabelText(/owner/i), {
      target: { value: "member-2" },
    });

    fireEvent.change(screen.getByLabelText(/^title$/i), {
      target: { value: "Updated action title" },
    });

    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: ActionStatus.CLOSED },
    });

    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: "2026-10-01" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /edit update/i,
      }),
    );

    await waitFor(() => {
      expect(mockedActionAPI.editAction).toHaveBeenCalledWith("action-1", {
        ownerId: "member-2",
        title: "Updated action title",
        status: ActionStatus.CLOSED,
        dueDate: "2026-10-01",
      });
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Successfully edited the action!",
      );

      expect(mockPush).toHaveBeenCalledWith("/actions/action-1");
    });
  });

  it("shows an error toast when editing fails", async () => {
    const error = new Error("Failed to edit action");

    mockedActionAPI.editAction.mockRejectedValue(error);

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: /edit update/i,
      }),
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error editing the action!");
    });

    expect(mockPush).not.toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it("does not submit when fields are invalid", async () => {
    await renderPage();

    fireEvent.change(screen.getByLabelText(/owner/i), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByLabelText(/^title$/i), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: "" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /edit update/i,
      }),
    );

    await waitFor(() => {
      expect(mockedActionAPI.editAction).not.toHaveBeenCalled();
    });
  });

  it("handles an error when fetching members", async () => {
    const error = new Error("Failed to fetch members");

    mockedMemberAPI.getAllMembers.mockRejectedValue(error);

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<EditAction />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error fetching members:",
        error,
      );
    });

    consoleError.mockRestore();
  });

  it("handles an error when fetching the action", async () => {
    const error = new Error("Failed to fetch action");

    mockedActionAPI.getSingleAction.mockRejectedValue(error);

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<EditAction />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error fetching action:",
        error,
      );
    });

    consoleError.mockRestore();
  });
});
