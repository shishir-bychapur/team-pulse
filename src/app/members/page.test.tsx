import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Members from "./page";
import { memberAPI } from "@/src/apis/member";
import { Member } from "@/src/types/member";

jest.mock("@/src/apis/member", () => ({
  memberAPI: {
    getAllMembers: jest.fn(),
  },
}));

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

const mockedMemberAPI = memberAPI as jest.Mocked<typeof memberAPI>;

const mockMembers = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
] as Member[];

describe("Members Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches member data and renders title along with AllMembers component", async () => {
    mockedMemberAPI.getAllMembers.mockResolvedValue({
      members: mockMembers,
    });

    const ResolvedMembers = await Members();
    render(ResolvedMembers);

    expect(mockedMemberAPI.getAllMembers).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole("heading", { name: "Members" }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("all-members")).toBeInTheDocument();

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("throws an error when memberAPI fails", async () => {
    mockedMemberAPI.getAllMembers.mockRejectedValue(new Error("Network Error"));

    await expect(Members()).rejects.toThrow("Network Error");
  });
});
