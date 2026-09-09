import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Members from "./page";
import { memberService } from "@/src/services/member";
import { MemberWithRole } from "@/src/types/member";

jest.mock("@/src/services/member", () => ({
  memberService: {
    getMembers: jest.fn(),
  },
}));

jest.mock("@/src/components/members/all-members", () => ({
  AllMembers: function MockAllMembers({
    members,
  }: {
    members: MemberWithRole[];
  }) {
    return (
      <div data-testid="all-members">
        {members.map((member) => (
          <span key={member.id}>{member.name}</span>
        ))}
      </div>
    );
  },
}));

const mockedMemberService = memberService as jest.Mocked<typeof memberService>;

const mockMembers: MemberWithRole[] = [
  {
    id: "1",
    name: "Alice",
    email: "alice@email.com",
    roleId: "role-1",
    timezone: "Asia/Singapore",
    role: {
      id: "role-1",
      name: "Developer",
    },
  },
  {
    id: "2",
    name: "Bob",
    email: "bob@email.com",
    roleId: "role-2",
    timezone: "Asia/London",
    role: {
      id: "role-2",
      name: "Designer",
    },
  },
];

describe("Members Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches members and renders the page correctly", async () => {
    mockedMemberService.getMembers.mockResolvedValue(mockMembers);

    const ResolvedMembers = await Members();
    render(ResolvedMembers);

    expect(mockedMemberService.getMembers).toHaveBeenCalledTimes(1);

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
    mockedMemberService.getMembers.mockResolvedValue(mockMembers);

    const ResolvedMembers = await Members();
    render(ResolvedMembers);

    expect(screen.getByTestId("all-members")).toBeInTheDocument();

    mockMembers.forEach((member) => {
      expect(screen.getByText(member.name)).toBeInTheDocument();
    });
  });

  it("throws an error when fetching members fails", async () => {
    mockedMemberService.getMembers.mockRejectedValue(
      new Error("Database Error"),
    );

    await expect(Members()).rejects.toThrow("Database Error");
  });
});
