import "@testing-library/jest-dom";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import Updates from "./page";
import { Dispatch, SetStateAction } from "react";
import { Mood, Update } from "@/src/types/update";
import { memberAPI } from "@/src/utils/apis/member";
import { updateAPI } from "@/src/utils/apis/update";

jest.mock("../../components/filters/member-filter", () => {
  return function MockMemberFilter({
    setFilter,
  }: {
    setFilter: Dispatch<SetStateAction<string[]>>;
  }) {
    return (
      <button
        data-testid="member-filter-btn"
        onClick={() => setFilter(["member-1"])}
      >
        Filter Member
      </button>
    );
  };
});

jest.mock("../../components/filters/mood-filter", () => {
  return function MockMoodFilter({
    setFilter,
  }: {
    setFilter: Dispatch<SetStateAction<string[]>>;
  }) {
    return (
      <button
        data-testid="mood-filter-btn"
        onClick={() => setFilter(["happy"])}
      >
        Filter Mood
      </button>
    );
  };
});

jest.mock("../../components/filters/date-filter", () => {
  return function MockDateFilter({
    setFilter,
  }: {
    setFilter: Dispatch<SetStateAction<string>>;
  }) {
    return (
      <button
        data-testid="date-filter-btn"
        onClick={() => setFilter("2026-03-01")}
      >
        Filter Date
      </button>
    );
  };
});

jest.mock("../../components/updates/update", () => {
  return function MockUpdateCard({
    update,
    memberName,
  }: {
    update: Update;
    memberName: string;
  }) {
    return (
      <li data-testid="update-card">
        {update.text} - {memberName}
      </li>
    );
  };
});

jest.mock("@/src/utils/apis/member", () => ({
  memberAPI: {
    getAllMembers: jest.fn(),
  },
}));

jest.mock("@/src/utils/apis/update", () => ({
  updateAPI: {
    getUpdates: jest.fn(),
  },
}));

const mockMembers = [
  {
    id: "member-1",
    name: "Alice",
    role: { id: "role-1", name: "Developer" },
    timezone: "UTC",
  },
  {
    id: "member-2",
    name: "Bob",
    role: { id: "role-1", name: "Developer" },
    timezone: "UTC",
  },
];

const mockUpdates: Update[] = [
  {
    id: "update-1",
    memberId: "member-1",
    text: "Finished feature A",
    date: "2026-09-01",
    mood: Mood.RED,
  },
  {
    id: "update-2",
    memberId: "member-2",
    text: "Working on bug B",
    date: "2026-09-02",
    mood: Mood.GREEN,
  },
];

const mockedMemberAPI = memberAPI as jest.Mocked<typeof memberAPI>;
const mockedUpdateAPI = updateAPI as jest.Mocked<typeof updateAPI>;

describe("Updates Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders static text elements", async () => {
    mockedMemberAPI.getAllMembers.mockResolvedValue({
      members: mockMembers,
    });
    mockedUpdateAPI.getUpdates.mockResolvedValue({
      updates: mockUpdates,
    });

    await act(async () => {
      render(<Updates />);
    });

    expect(screen.getByText("Updates")).toBeInTheDocument();

    expect(
      screen.getByText("Keep track of your team's latest updates."),
    ).toBeInTheDocument();

    expect(screen.getByText("Filter updates")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Filter by member, mood, or date to find specific updates.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Recent updates")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "+ Create Update" }),
    ).toBeInTheDocument();
  });

  it("fetches members and updates on initial render", async () => {
    mockedMemberAPI.getAllMembers.mockResolvedValue({
      members: mockMembers,
    });
    mockedUpdateAPI.getUpdates.mockResolvedValue({
      updates: mockUpdates,
    });

    await act(async () => {
      render(<Updates />);
    });

    const cardItems = await screen.findAllByTestId("update-card");

    expect(cardItems).toHaveLength(2);

    expect(screen.getByText("Finished feature A - Alice")).toBeInTheDocument();

    expect(screen.getByText("Working on bug B - Bob")).toBeInTheDocument();

    expect(screen.getByText("2 updates")).toBeInTheDocument();
  });

  it("triggers a new fetch with query params when filters change", async () => {
    mockedMemberAPI.getAllMembers.mockResolvedValue({
      members: mockMembers,
    });
    mockedUpdateAPI.getUpdates.mockResolvedValue({
      updates: mockUpdates,
    });
    render(<Updates />);

    fireEvent.click(screen.getByTestId("member-filter-btn"));

    await waitFor(() => {
      expect(updateAPI.getUpdates).toHaveBeenCalledWith("members=member-1");
    });

    fireEvent.click(screen.getByTestId("mood-filter-btn"));

    await waitFor(() => {
      expect(updateAPI.getUpdates).toHaveBeenCalledWith(
        "members=member-1&moods=happy",
      );
    });

    fireEvent.click(screen.getByTestId("date-filter-btn"));

    await waitFor(() => {
      expect(updateAPI.getUpdates).toHaveBeenCalledWith(
        "members=member-1&moods=happy&date=2026-03-01",
      );
    });
  });

  it("handles API errors gracefully without crashing", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockedMemberAPI.getAllMembers.mockRejectedValue(new Error("Network Error"));
    mockedUpdateAPI.getUpdates.mockRejectedValue(new Error("Network Error"));

    render(<Updates />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching members:",
        expect.any(Error),
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching updates:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });
});
