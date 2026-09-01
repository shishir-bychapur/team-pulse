import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { AllMembers } from "./all-members";
import { members } from "../../data/member";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      pathname: "/members",
    };
  },
}));

describe("Single Member", () => {
  it("renders correctly", async () => {
    await act(async () => render(<AllMembers members={members} />));

    await waitFor(() => {
      for (const member of members) {
        const memberName = screen.getByText(member.name);
        expect(memberName).toBeInTheDocument();
      }
    });
  });
});
