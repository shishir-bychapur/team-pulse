import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MemberPage from "./page";
import { notFound } from "next/navigation";
import { Member } from "@/src/types/member";
import { memberAPI } from "@/src/apis/member";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@/src/apis/member", () => ({
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

describe("Member Page", () => {
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
      screen.getByRole("heading", { name: "Member Page" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("UTC-5")).toBeInTheDocument();
  });

  it("calls notFound() when the member is null", async () => {
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
