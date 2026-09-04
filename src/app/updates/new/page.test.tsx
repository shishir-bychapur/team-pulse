import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CreateUpdate from "./page";
import { Mood } from "@/src/types/update";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { toast } from "sonner";

const mockMembers = [
  {
    id: "member-1",
    name: "Alice",
    role: {
      name: "Developer",
      id: "1",
    },
  },
  {
    id: "member-2",
    name: "Bob",
    role: {
      name: "Designer",
      id: "2",
    },
  },
];

describe("CreateUpdate Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(global, "fetch").mockImplementation((url) => {
      const urlString = typeof url === "string" ? url : url.toString();

      if (urlString === "/api/members") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ members: mockMembers }),
        } as Response);
      }

      if (urlString === "/api/updates") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        } as Response);
      }

      return Promise.reject(new Error("Unknown endpoint"));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the form fields", async () => {
    render(<CreateUpdate />);

    expect(
      screen.getByRole("heading", { name: "Create an Update" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Share an update about your progress, mood, or current work.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Member")).toBeInTheDocument();
    expect(screen.getByLabelText("Update")).toBeInTheDocument();
    expect(screen.getByLabelText("Mood")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Create Update" }),
    ).toBeInTheDocument();

    await screen.findByRole("option", {
      name: "Alice (Developer)",
    });
  });

  it("fetches and displays members", async () => {
    render(<CreateUpdate />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/members");
    });

    expect(
      await screen.findByRole("option", {
        name: "Alice (Developer)",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Bob (Designer)",
      }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", async () => {
    render(<CreateUpdate />);

    await screen.findByRole("option", {
      name: "Alice (Developer)",
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Create Update",
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Member is invalid!")).toBeInTheDocument();

      expect(
        screen.getByText("Update text cannot be empty!"),
      ).toBeInTheDocument();

      expect(
        screen.getByText("Mood must be of type Red, Yellow or Green!"),
      ).toBeInTheDocument();

      expect(
        screen.getByText("Date must be in YYYY-MM-DD format!"),
      ).toBeInTheDocument();
    });

    expect(global.fetch).not.toHaveBeenCalledWith(
      "/api/updates",
      expect.anything(),
    );
  });

  it("handles member API errors gracefully", async () => {
    jest.restoreAllMocks();

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    jest.spyOn(global, "fetch").mockRejectedValue(new Error("Network Error"));

    render(<CreateUpdate />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching members:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it("allows the user to fill in the form", async () => {
    render(<CreateUpdate />);

    await screen.findByRole("option", {
      name: "Alice (Developer)",
    });

    const memberSelect = screen.getByLabelText("Member");
    const updateInput = screen.getByLabelText("Update");
    const moodSelect = screen.getByLabelText("Mood");
    const dateInput = screen.getByLabelText("Date");

    fireEvent.change(memberSelect, {
      target: {
        value: "member-1",
      },
    });

    fireEvent.change(updateInput, {
      target: {
        value: "Finished feature A",
      },
    });

    fireEvent.change(moodSelect, {
      target: {
        value: Mood.GREEN,
      },
    });

    fireEvent.change(dateInput, {
      target: {
        value: "2026-09-04",
      },
    });

    expect(memberSelect).toHaveValue("member-1");
    expect(updateInput).toHaveValue("Finished feature A");
    expect(moodSelect).toHaveValue(Mood.GREEN);
    expect(dateInput).toHaveValue("2026-09-04");
  });

  it("submits the form successfully", async () => {
    render(<CreateUpdate />);

    await screen.findByRole("option", {
      name: "Alice (Developer)",
    });

    fireEvent.change(screen.getByLabelText("Member"), {
      target: {
        value: "member-1",
      },
    });

    fireEvent.change(screen.getByLabelText("Update"), {
      target: {
        value: "Finished feature A",
      },
    });

    fireEvent.change(screen.getByLabelText("Mood"), {
      target: {
        value: Mood.GREEN,
      },
    });

    fireEvent.change(screen.getByLabelText("Date"), {
      target: {
        value: "2026-09-04",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Create Update",
      }),
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/updates",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            memberId: "member-1",
            text: "Finished feature A",
            mood: Mood.GREEN,
            date: "2026-09-04",
          }),
        }),
      );
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Successfully created the update!",
      );
    });
  });

  it("resets the form after successful submission", async () => {
    render(<CreateUpdate />);

    await screen.findByRole("option", {
      name: "Alice (Developer)",
    });

    fireEvent.change(screen.getByLabelText("Member"), {
      target: {
        value: "member-1",
      },
    });

    fireEvent.change(screen.getByLabelText("Update"), {
      target: {
        value: "Finished feature A",
      },
    });

    fireEvent.change(screen.getByLabelText("Mood"), {
      target: {
        value: Mood.GREEN,
      },
    });

    fireEvent.change(screen.getByLabelText("Date"), {
      target: {
        value: "2026-09-04",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Create Update",
      }),
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Successfully created the update!",
      );
    });

    expect(screen.getByLabelText("Member")).toHaveValue("");
    expect(screen.getByLabelText("Update")).toHaveValue("");
    expect(screen.getByLabelText("Mood")).toHaveValue("");
    expect(screen.getByLabelText("Date")).toHaveValue("");
  });

  it("shows an error toast when creating an update fails", async () => {
    jest.restoreAllMocks();

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    jest.spyOn(global, "fetch").mockImplementation((url) => {
      const urlString = typeof url === "string" ? url : url.toString();

      if (urlString === "/api/members") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ members: mockMembers }),
        } as Response);
      }

      if (urlString === "/api/updates") {
        return Promise.reject(new Error("Network Error"));
      }

      return Promise.reject(new Error("Unknown endpoint"));
    });

    render(<CreateUpdate />);

    await screen.findByRole("option", {
      name: "Alice (Developer)",
    });

    fireEvent.change(screen.getByLabelText("Member"), {
      target: {
        value: "member-1",
      },
    });

    fireEvent.change(screen.getByLabelText("Update"), {
      target: {
        value: "Something went wrong",
      },
    });

    fireEvent.change(screen.getByLabelText("Mood"), {
      target: {
        value: Mood.GREEN,
      },
    });

    fireEvent.change(screen.getByLabelText("Date"), {
      target: {
        value: "2026-09-04",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Create Update",
      }),
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error creating a new update!");
    });

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));

    consoleSpy.mockRestore();
  });

  it("shows an error when member is missing", async () => {
    render(<CreateUpdate />);

    await screen.findByRole("option", {
      name: "Alice (Developer)",
    });

    fireEvent.change(screen.getByLabelText("Update"), {
      target: {
        value: "Finished feature A",
      },
    });

    fireEvent.change(screen.getByLabelText("Mood"), {
      target: {
        value: Mood.GREEN,
      },
    });

    fireEvent.change(screen.getByLabelText("Date"), {
      target: {
        value: "2026-09-04",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Create Update",
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Member is invalid!")).toBeInTheDocument();
    });

    expect(
      screen.queryByText("Update text cannot be empty!"),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Mood must be of type Red, Yellow or Green!"),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Date must be in YYYY-MM-DD format!"),
    ).not.toBeInTheDocument();
  });

  it("shows an error when update text is missing", async () => {
    render(<CreateUpdate />);

    await screen.findByRole("option", {
      name: "Alice (Developer)",
    });

    fireEvent.change(screen.getByLabelText("Member"), {
      target: {
        value: "member-1",
      },
    });

    fireEvent.change(screen.getByLabelText("Mood"), {
      target: {
        value: Mood.GREEN,
      },
    });

    fireEvent.change(screen.getByLabelText("Date"), {
      target: {
        value: "2026-09-04",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Create Update",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Update text cannot be empty!"),
      ).toBeInTheDocument();
    });
  });

  it("shows an error when mood is missing", async () => {
    render(<CreateUpdate />);

    await screen.findByRole("option", {
      name: "Alice (Developer)",
    });

    fireEvent.change(screen.getByLabelText("Member"), {
      target: {
        value: "member-1",
      },
    });

    fireEvent.change(screen.getByLabelText("Update"), {
      target: {
        value: "Finished feature A",
      },
    });

    fireEvent.change(screen.getByLabelText("Date"), {
      target: {
        value: "2026-09-04",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Create Update",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Mood must be of type Red, Yellow or Green!"),
      ).toBeInTheDocument();
    });
  });

  it("shows an error when date is missing", async () => {
    render(<CreateUpdate />);

    await screen.findByRole("option", {
      name: "Alice (Developer)",
    });

    fireEvent.change(screen.getByLabelText("Member"), {
      target: {
        value: "member-1",
      },
    });

    fireEvent.change(screen.getByLabelText("Update"), {
      target: {
        value: "Finished feature A",
      },
    });

    fireEvent.change(screen.getByLabelText("Mood"), {
      target: {
        value: Mood.GREEN,
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Create Update",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Date must be in YYYY-MM-DD format!"),
      ).toBeInTheDocument();
    });
  });
});
