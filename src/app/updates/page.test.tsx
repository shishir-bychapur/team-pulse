import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import UpdatePage from "./page";
import { memberService } from "@/src/services/member";
import { verifySession } from "@/src/utils/session";
import { MemberWithRole } from "@/src/types/member";

jest.mock("@/src/services/member", () => ({
  memberService: {
    getMembers: jest.fn(),
  },
}));

jest.mock("@/src/utils/session", () => ({
  verifySession: jest.fn(),
}));

jest.mock("@/src/components/updates/updates", () => {
  return function MockUpdates({
    members,
    userId,
  }: {
    members: MemberWithRole[];
    userId: string;
  }) {
    return (
      <div data-testid="updates-component">
        <span data-testid="members-count">{members.length}</span>
        <span data-testid="user-id">{userId}</span>
      </div>
    );
  };
});

const mockedMemberService = memberService as jest.Mocked<typeof memberService>;

const mockedVerifySession = jest.mocked(verifySession);

describe("UpdatePage", () => {
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

  beforeEach(() => {
    jest.clearAllMocks();

    mockedMemberService.getMembers.mockResolvedValue(mockMembers);

    mockedVerifySession.mockResolvedValue({
      isAuth: true,
      id: "member-1",
      name: "Tom",
    });
  });

  it("renders the page heading and description", async () => {
    const component = await UpdatePage();

    render(component);

    expect(
      screen.getByRole("heading", { name: "Updates" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Keep track of your team's latest updates."),
    ).toBeInTheDocument();
  });

  it("renders the create update link", async () => {
    const component = await UpdatePage();

    render(component);

    const link = screen.getByRole("link", {
      name: "+ Create Update",
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/updates/new");
  });

  it("fetches all members", async () => {
    const component = await UpdatePage();

    render(component);

    expect(mockedMemberService.getMembers).toHaveBeenCalledTimes(1);
  });

  it("verifies the user session", async () => {
    const component = await UpdatePage();

    render(component);

    expect(mockedVerifySession).toHaveBeenCalledTimes(1);
  });

  it("passes members to the Updates component", async () => {
    const component = await UpdatePage();

    render(component);

    expect(screen.getByTestId("updates-component")).toBeInTheDocument();

    expect(screen.getByTestId("members-count")).toHaveTextContent("2");
  });

  it("passes the session user id to the Updates component", async () => {
    const component = await UpdatePage();

    render(component);

    expect(screen.getByTestId("user-id")).toHaveTextContent("member-1");
  });

  it("passes an empty string when the session has no user id", async () => {
    mockedVerifySession.mockResolvedValue({
      isAuth: true,
      id: null,
      name: null,
    });

    const component = await UpdatePage();

    render(component);

    expect(screen.getByTestId("user-id")).toHaveTextContent("");
  });
});
