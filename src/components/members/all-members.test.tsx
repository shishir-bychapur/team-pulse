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
  describe("Successful API Call", () => {
    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ members: members }),
        }),
      ) as jest.Mock;
    });

    it("renders correctly", async () => {
      await act(async () => render(<AllMembers />));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();

        for (const member of members) {
          const memberName = screen.getByText(member.name);
          expect(memberName).toBeInTheDocument();
        }
      });
    });
  });

  describe("Failed API Call", () => {
    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error("API call failed")),
      ) as jest.Mock;
    });

    it("renders error message", async () => {
      await act(async () => render(<AllMembers />));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
        const errorMessage = screen.getByText("Unable to fetch members!");
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });
});
