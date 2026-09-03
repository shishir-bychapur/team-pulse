import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Members from "./page";
import { Member } from "@/src/types/member";

jest.mock("@/src/components/members/all-members", () => ({
  AllMembers: function MockAllMembers({ members }: { members: Member[] }) {
    return (
      <div data-testid="all-members">
        {members.map((m) => (
          <span key={m.id}>{m.name}</span>
        ))}
      </div>
    );
  },
}));

const mockMembers = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
];

describe("Members Page", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation((url) => {
      if (url === "http://localhost:3000/api/members") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ members: mockMembers }),
        } as Response);
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });
  });

  it("fetches member data and renders title along with AllMembers component", async () => {
    const ResolvedMembers = await Members();
    render(ResolvedMembers);

    expect(screen.getByText("Members")).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/members",
    );

    expect(screen.getByTestId("all-members")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("handles fetch or network errors gracefully", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("Network Error"));

    await expect(Members()).rejects.toThrow("Network Error");
  });
});
