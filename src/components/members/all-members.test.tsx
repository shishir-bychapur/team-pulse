import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { AllMembers } from "./all-members";
import { MemberWithRole } from "@/src/types/member";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockMembers: MemberWithRole[] = [
  {
    id: "1",
    name: "Tom",
    role: {
      id: "role-1",
      name: "Developer",
    },
    timezone: "Asia/Singapore",
    email: "tom@email.com",
    roleId: "role-1",
  },
  {
    id: "2",
    name: "Harry",
    role: {
      id: "role-2",
      name: "Designer",
    },
    timezone: "Asia/London",
    email: "harry@email.com",
    roleId: "role-2",
  },
  {
    id: "3",
    name: "Dominic",
    role: {
      id: "role-3",
      name: "Manager",
    },
    timezone: "America/New_York",
    email: "dominic@email.com",
    roleId: "role-3",
  },
];

describe("AllMembers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all members", () => {
    render(<AllMembers members={mockMembers} />);

    mockMembers.forEach((member) => {
      expect(screen.getByText(member.name)).toBeInTheDocument();
    });
  });

  it("renders all member roles", () => {
    render(<AllMembers members={mockMembers} />);

    mockMembers.forEach((member) => {
      expect(screen.getAllByText(member.role.name).length).toBeGreaterThan(0);
    });
  });

  it("displays the correct member count", () => {
    render(<AllMembers members={mockMembers} />);

    expect(
      screen.getByText(`${mockMembers.length} members`),
    ).toBeInTheDocument();
  });

  it("navigates to the correct member page when a card is clicked", () => {
    render(<AllMembers members={mockMembers} />);

    const firstMember = mockMembers[0];

    fireEvent.click(
      screen.getByRole("button", {
        name: new RegExp(firstMember.name, "i"),
      }),
    );

    expect(mockPush).toHaveBeenCalledWith(`/members/${firstMember.id}`);
  });

  it("renders the empty state when there are no members", () => {
    render(<AllMembers members={[]} />);

    expect(screen.getByText("No members found")).toBeInTheDocument();

    expect(
      screen.getByText("There are currently no members to display."),
    ).toBeInTheDocument();
  });

  it("displays singular member text when there is one member", () => {
    render(<AllMembers members={[mockMembers[0]]} />);

    expect(screen.getByText("1 member")).toBeInTheDocument();
  });
});
