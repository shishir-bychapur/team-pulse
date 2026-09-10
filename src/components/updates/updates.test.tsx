import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Updates from "./updates";
import { updateAPI } from "@/src/utils/apis/update";
import { MemberWithRole } from "@/src/types/member";
import { Mood } from "@/generated/prisma/enums";
import { UpdateWithMember } from "@/src/types/update";

jest.mock("@/src/utils/apis/update", () => ({
  updateAPI: {
    getUpdates: jest.fn(),
  },
}));

jest.mock("../filters/member-filter", () => ({
  __esModule: true,
  default: ({
    filter,
    setFilter,
  }: {
    filter: string[];
    setFilter: React.Dispatch<React.SetStateAction<string[]>>;
  }) => (
    <button onClick={() => setFilter(["member-1"])}>
      Member Filter: {filter.join(",")}
    </button>
  ),
}));

jest.mock("../filters/mood-filter", () => ({
  __esModule: true,
  default: ({
    filter,
    setFilter,
  }: {
    filter: string[];
    setFilter: React.Dispatch<React.SetStateAction<string[]>>;
  }) => (
    <button onClick={() => setFilter(["GREEN"])}>
      Mood Filter: {filter.join(",")}
    </button>
  ),
}));

jest.mock("../filters/date-filter", () => ({
  __esModule: true,
  default: ({
    filter,
    setFilter,
  }: {
    filter: string;
    setFilter: React.Dispatch<React.SetStateAction<string>>;
  }) => (
    <button onClick={() => setFilter("2026-09-09")}>
      Date Filter: {filter}
    </button>
  ),
}));

jest.mock("./update", () => ({
  __esModule: true,
  default: ({
    memberName,
    update,
  }: {
    memberName: string;
    update: { text: string };
  }) => (
    <li>
      {memberName}: {update.text}
    </li>
  ),
}));

const mockedUpdateAPI = updateAPI as jest.Mocked<typeof updateAPI>;

describe("Updates", () => {
  const mockMembers: MemberWithRole[] = [
    {
      id: "member-1",
      name: "Tom",
      timezone: "Asia/Singapore",
      roleId: "role-1",
      role: {
        id: "role-1",
        name: "Developer",
      },
      email: "tom@email.com",
    },
    {
      id: "member-2",
      name: "Harry",
      timezone: "Europe/London",
      roleId: "role-2",
      role: {
        id: "role-2",
        name: "Designer",
      },
      email: "harry@email.com",
    },
  ];

  const mockUpdates: UpdateWithMember[] = [
    {
      id: "update-1",
      memberId: "member-1",
      mood: Mood.GREEN,
      date: "2026-09-09",
      text: "Finished the dashboard",
      member: {
        id: "member-1",
        name: "Tom",
        timezone: "Asia/Singapore",
        roleId: "role-1",
        email: "tom@email.com",
      },
    },
    {
      id: "update-2",
      memberId: "member-2",
      mood: Mood.RED,
      date: "2026-09-09",
      text: "Working on tests",
      member: {
        id: "member-2",
        name: "Harry",
        timezone: "Europe/London",
        roleId: "role-2",
        email: "harry@email.com",
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the filter section", async () => {
    mockedUpdateAPI.getUpdates.mockResolvedValue({
      updates: [],
    });

    render(<Updates members={mockMembers} userId="member-1" />);

    expect(screen.getByText("Filter updates")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Filter by member, mood, or date to find specific updates.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "My Updates" }),
    ).toBeInTheDocument();

    await screen.findByText("0 updates");
  });

  it("fetches updates when the component mounts", async () => {
    mockedUpdateAPI.getUpdates.mockResolvedValue({
      updates: mockUpdates,
    });

    render(<Updates members={mockMembers} userId="member-1" />);

    await screen.findByText("Tom: Finished the dashboard");

    expect(mockedUpdateAPI.getUpdates).toHaveBeenCalledTimes(1);

    expect(mockedUpdateAPI.getUpdates).toHaveBeenCalledWith("");
  });

  it("renders updates successfully", async () => {
    mockedUpdateAPI.getUpdates.mockResolvedValue({
      updates: mockUpdates,
    });

    render(<Updates members={mockMembers} userId="member-1" />);

    expect(
      await screen.findByText("Tom: Finished the dashboard"),
    ).toBeInTheDocument();

    expect(screen.getByText("Harry: Working on tests")).toBeInTheDocument();

    expect(screen.getByText("2 updates")).toBeInTheDocument();
  });

  it("shows no updates found when there are no updates", async () => {
    mockedUpdateAPI.getUpdates.mockResolvedValue({
      updates: [],
    });

    render(<Updates members={mockMembers} userId="member-1" />);

    expect(await screen.findByText("No updates found")).toBeInTheDocument();

    expect(
      screen.getByText("Try changing your filters or create a new update."),
    ).toBeInTheDocument();

    expect(screen.getByText("0 updates")).toBeInTheDocument();
  });

  it("shows singular update when there is one update", async () => {
    mockedUpdateAPI.getUpdates.mockResolvedValue({
      updates: [mockUpdates[0]],
    });

    render(<Updates members={mockMembers} userId="member-1" />);

    expect(await screen.findByText("1 update")).toBeInTheDocument();
  });

  it("filters by my updates when My Updates is clicked", async () => {
    mockedUpdateAPI.getUpdates.mockResolvedValue({
      updates: [],
    });

    render(<Updates members={mockMembers} userId="member-1" />);

    await screen.findByText("0 updates");

    fireEvent.click(
      screen.getByRole("button", {
        name: "My Updates",
      }),
    );

    await waitFor(() => {
      expect(mockedUpdateAPI.getUpdates).toHaveBeenLastCalledWith(
        "members=member-1",
      );
    });
  });

  it("removes the my updates filter when My Updates is clicked again", async () => {
    mockedUpdateAPI.getUpdates.mockResolvedValue({
      updates: [],
    });

    render(<Updates members={mockMembers} userId="member-1" />);

    await screen.findByText("0 updates");

    const myUpdatesButton = screen.getByRole("button", {
      name: "My Updates",
    });

    fireEvent.click(myUpdatesButton);

    await waitFor(() => {
      expect(mockedUpdateAPI.getUpdates).toHaveBeenLastCalledWith(
        "members=member-1",
      );
    });

    fireEvent.click(myUpdatesButton);

    await waitFor(() => {
      expect(mockedUpdateAPI.getUpdates).toHaveBeenLastCalledWith("");
    });
  });

  it("fetches updates when the member filter changes", async () => {
    mockedUpdateAPI.getUpdates.mockResolvedValue({
      updates: [],
    });

    render(<Updates members={mockMembers} userId="member-2" />);

    await screen.findByText("0 updates");

    fireEvent.click(
      screen.getByRole("button", {
        name: /Member Filter/,
      }),
    );

    await waitFor(() => {
      expect(mockedUpdateAPI.getUpdates).toHaveBeenLastCalledWith(
        "members=member-1",
      );
    });
  });

  it("fetches updates when the mood filter changes", async () => {
    mockedUpdateAPI.getUpdates.mockResolvedValue({
      updates: [],
    });

    render(<Updates members={mockMembers} userId="member-1" />);

    await screen.findByText("0 updates");

    fireEvent.click(
      screen.getByRole("button", {
        name: /Mood Filter/,
      }),
    );

    await waitFor(() => {
      expect(mockedUpdateAPI.getUpdates).toHaveBeenLastCalledWith(
        "moods=GREEN",
      );
    });
  });

  it("fetches updates when the date filter changes", async () => {
    mockedUpdateAPI.getUpdates.mockResolvedValue({
      updates: [],
    });

    render(<Updates members={mockMembers} userId="member-1" />);

    await screen.findByText("0 updates");

    fireEvent.click(
      screen.getByRole("button", {
        name: /Date Filter/,
      }),
    );

    await waitFor(() => {
      expect(mockedUpdateAPI.getUpdates).toHaveBeenLastCalledWith(
        "date=2026-09-09",
      );
    });
  });

  it("does not crash when fetching updates fails", async () => {
    mockedUpdateAPI.getUpdates.mockRejectedValue(
      new Error("Failed to fetch updates"),
    );

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<Updates members={mockMembers} userId="member-1" />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });

    expect(screen.getByText("No updates found")).toBeInTheDocument();

    consoleError.mockRestore();
  });
});
