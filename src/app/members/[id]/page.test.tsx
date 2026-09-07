import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MemberPage from "./page";
import { notFound } from "next/navigation";
import { Member } from "@/src/types/member";
import { memberAPI } from "@/src/utils/apis/member";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@/src/utils/apis/member", () => ({
  memberAPI: {
    getSingleMember: jest.fn(),
  },
}));

const mockedMemberAPI = memberAPI as jest.Mocked<typeof memberAPI>;
const mockedNotFound = notFound as jest.MockedFunction<typeof notFound>;

const mockMember: Member = {
  id: "123",
  name: "Alice Johnson",
  role: {
    name: "Software Engineer",
    id: "1",
  },
  timezone: "UTC-5",
};

describe("MemberPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and renders member details successfully", async () => {
    mockedMemberAPI.getSingleMember.mockResolvedValue({
      member: mockMember,
    });

    const params = Promise.resolve({ id: "123" });

    const ResolvedPage = await MemberPage({ params });

    render(ResolvedPage);

    expect(mockedMemberAPI.getSingleMember).toHaveBeenCalledWith("123");

    expect(
      screen.getByRole("heading", { name: "Member Details" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("View information about this team member."),
    ).toBeInTheDocument();

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();

    // Role appears in both the profile badge and member information section
    expect(screen.getAllByText("Software Engineer").length).toBeGreaterThan(0);

    expect(screen.getByText("UTC-5")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Member Information" }),
    ).toBeInTheDocument();
  });

  it("renders a link back to the members page", async () => {
    mockedMemberAPI.getSingleMember.mockResolvedValue({
      member: mockMember,
    });

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
    mockedMemberAPI.getSingleMember.mockResolvedValue({
      member: mockMember,
    });

    const params = Promise.resolve({ id: "123" });

    const ResolvedPage = await MemberPage({ params });

    render(ResolvedPage);

    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("calls notFound when the member is null", async () => {
    mockedMemberAPI.getSingleMember.mockResolvedValue({
      member: null,
    });

    const params = Promise.resolve({ id: "999" });

    await MemberPage({ params });

    expect(mockedMemberAPI.getSingleMember).toHaveBeenCalledWith("999");
    expect(mockedNotFound).toHaveBeenCalledTimes(1);
  });

  it("throws when memberAPI encounters a network error", async () => {
    mockedMemberAPI.getSingleMember.mockRejectedValue(
      new Error("Network Error!"),
    );

    const params = Promise.resolve({ id: "123" });

    await expect(MemberPage({ params })).rejects.toThrow("Network Error!");
  });
});
