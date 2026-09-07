import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Members from "./page";
import { memberAPI } from "@/src/utils/apis/member";
import { Member } from "@/src/types/member";

jest.mock("@/src/utils/apis/member", () => ({
  memberAPI: {
    getAllMembers: jest.fn(),
  },
}));

jest.mock("@/src/components/members/all-members", () => ({
  AllMembers: function MockAllMembers({ members }: { members: Member[] }) {
    return (
      <div data-testid="all-members">
        {members.map((member) => (
          <span key={member.id}>{member.name}</span>
        ))}
      </div>
    );
  },
}));

const mockedMemberAPI = memberAPI as jest.Mocked<typeof memberAPI>;

const mockMembers = [
  {
    id: "1",
    name: "Alice",
    role: {
      id: "role-1",
      name: "Developer",
    },
    timezone: "Asia/Singapore",
  },
  {
    id: "2",
    name: "Bob",
    role: {
      id: "role-2",
      name: "Designer",
    },
    timezone: "Asia/London",
  },
] as Member[];

describe("Members Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches members and renders the page correctly", async () => {
    mockedMemberAPI.getAllMembers.mockResolvedValue({
      members: mockMembers,
    });

    const ResolvedMembers = await Members();
    render(ResolvedMembers);

    expect(mockedMemberAPI.getAllMembers).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole("heading", { name: "Members" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Browse and view information about your team members."),
    ).toBeInTheDocument();

    expect(screen.getByTestId("all-members")).toBeInTheDocument();

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("passes the fetched members to the AllMembers component", async () => {
    mockedMemberAPI.getAllMembers.mockResolvedValue({
      members: mockMembers,
    });

    const ResolvedMembers = await Members();
    render(ResolvedMembers);

    expect(screen.getByTestId("all-members")).toBeInTheDocument();

    mockMembers.forEach((member) => {
      expect(screen.getByText(member.name)).toBeInTheDocument();
    });
  });

  it("throws an error when fetching members fails", async () => {
    mockedMemberAPI.getAllMembers.mockRejectedValue(new Error("Network Error"));

    await expect(Members()).rejects.toThrow("Network Error");
  });
});
