import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MemberPage from "./page";
import { notFound } from "next/navigation";
import { Member } from "@/src/types/member";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

const mockMember: Member = {
  id: "123",
  name: "Alice Johnson",
  role: { name: "Software Engineer", id: "1" },
  timezone: "UTC-5",
};

describe("Member Page", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation((url) => {
      const urlString = typeof url === "string" ? url : url.toString();

      if (urlString === "http://localhost:3000/api/members/123") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ member: mockMember }),
        } as Response);
      }

      if (urlString === "http://localhost:3000/api/members/999") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ member: null }),
        } as Response);
      }

      return Promise.reject(new Error("Unknown endpoint"));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("fetches and renders member details successfully", async () => {
    const params = Promise.resolve({ id: "123" });
    const ResolvedPage = await MemberPage({ params });

    render(ResolvedPage);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/members/123",
    );
    expect(screen.getByText("Member Page")).toBeInTheDocument();
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("UTC-5")).toBeInTheDocument();
  });

  it("calls notFound() when the member is null", async () => {
    const params = Promise.resolve({ id: "999" });

    await MemberPage({ params });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/members/999",
    );
    expect(notFound).toHaveBeenCalled();
  });

  it("throws or handles fetch network errors", async () => {
    jest
      .spyOn(global, "fetch")
      .mockRejectedValue(new Error("Database offline"));

    const params = Promise.resolve({ id: "123" });

    await expect(MemberPage({ params })).rejects.toThrow("Database offline");
  });
});
