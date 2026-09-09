import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MemberPage from "./page";
import { notFound } from "next/navigation";
import { MemberWithRole } from "@/src/types/member";
import { memberService } from "@/src/services/member";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@/src/services/member", () => ({
  memberService: {
    getMember: jest.fn(),
  },
}));

const mockedMemberService = memberService as jest.Mocked<typeof memberService>;

const mockedNotFound = notFound as jest.MockedFunction<typeof notFound>;

const mockMember: MemberWithRole = {
  id: "123",
  name: "Alice Johnson",
  email: "alice@example.com",
  role: {
    name: "Software Engineer",
    id: "1",
  },
  timezone: "UTC-5",
  roleId: "1",
};

describe("MemberPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and renders member details successfully", async () => {
    mockedMemberService.getMember.mockResolvedValue(mockMember);

    const params = Promise.resolve({ id: "123" });

    const ResolvedPage = await MemberPage({ params });

    render(ResolvedPage);

    expect(mockedMemberService.getMember).toHaveBeenCalledWith("123");

    expect(
      screen.getByRole("heading", { name: "Member Details" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("View information about this team member."),
    ).toBeInTheDocument();

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();

    // Role appears in both the profile badge and member information section
    expect(screen.getAllByText("Software Engineer")).toHaveLength(2);

    expect(screen.getByText("alice@example.com")).toBeInTheDocument();

    expect(screen.getByText("UTC-5")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Member Information" }),
    ).toBeInTheDocument();
  });

  it("renders a link back to the members page", async () => {
    mockedMemberService.getMember.mockResolvedValue(mockMember);

    const params = Promise.resolve({ id: "123" });

    const ResolvedPage = await MemberPage({ params });

    render(ResolvedPage);

    const backLink = screen.getByRole("link", {
      name: /back to members/i,
    });

    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/members");
  });

  it("renders the member initial in the avatar", async () => {
    mockedMemberService.getMember.mockResolvedValue(mockMember);

    const params = Promise.resolve({ id: "123" });

    const ResolvedPage = await MemberPage({ params });

    render(ResolvedPage);

    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("calls notFound when the member is null", async () => {
    mockedMemberService.getMember.mockResolvedValue(null);

    const params = Promise.resolve({ id: "999" });

    await MemberPage({ params });

    expect(mockedMemberService.getMember).toHaveBeenCalledWith("999");
    expect(mockedNotFound).toHaveBeenCalledTimes(1);
  });

  it("throws when memberService encounters a network error", async () => {
    mockedMemberService.getMember.mockRejectedValue(
      new Error("Network Error!"),
    );

    const params = Promise.resolve({ id: "123" });

    await expect(MemberPage({ params })).rejects.toThrow("Network Error!");
  });
});
