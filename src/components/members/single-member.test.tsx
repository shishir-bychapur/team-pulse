import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import SingleMember from "./single-member";
import { members } from "../../data/member";

jest.mock("next/navigation", () => ({
  useParams() {
    return {
      id: "1",
    };
  },
}));

describe("Single Member", () => {
  describe("Successful API Call", () => {
    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ member: members[0] }),
        }),
      ) as jest.Mock;
    });

    it("renders correctly", async () => {
      await act(async () => render(<SingleMember />));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();

        const memberName = screen.getByText(members[0].name);
        const memberRole = screen.getByText(members[0].role.name);
        const memberTimeZone = screen.getByText(members[0].timezone);

        expect(memberName).toBeInTheDocument();
        expect(memberRole).toBeInTheDocument();
        expect(memberTimeZone).toBeInTheDocument();
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
      await act(async () => render(<SingleMember />));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
        const errorMessage = screen.getByText("Member not found!");
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });
});
