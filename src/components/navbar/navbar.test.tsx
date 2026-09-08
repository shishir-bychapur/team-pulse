import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Navbar from "./navbar";
import { authAPI } from "@/src/utils/apis/auth";

const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

jest.mock("@/src/utils/apis/auth", () => ({
  authAPI: {
    logout: jest.fn(),
  },
}));

describe("Navigation Bar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when logged in", () => {
    it("renders the correct navigation items", () => {
      render(<Navbar isLoggedIn={true} />);

      expect(screen.getByText("TeamPulse")).toBeInTheDocument();

      expect(screen.getAllByRole("link", { name: "Members" })).toHaveLength(2);
      expect(screen.getAllByRole("link", { name: "Actions" })).toHaveLength(2);
      expect(screen.getAllByRole("link", { name: "Updates" })).toHaveLength(2);

      expect(screen.getAllByRole("button", { name: "Logout" })).toHaveLength(2);

      expect(
        screen.queryByRole("link", { name: "Login" }),
      ).not.toBeInTheDocument();
    });

    it("has the correct hrefs", () => {
      render(<Navbar isLoggedIn={true} />);

      expect(screen.getByRole("link", { name: "TeamPulse" })).toHaveAttribute(
        "href",
        "/",
      );

      screen.getAllByRole("link", { name: "Members" }).forEach((link) => {
        expect(link).toHaveAttribute("href", "/members");
      });

      screen.getAllByRole("link", { name: "Actions" }).forEach((link) => {
        expect(link).toHaveAttribute("href", "/actions");
      });

      screen.getAllByRole("link", { name: "Updates" }).forEach((link) => {
        expect(link).toHaveAttribute("href", "/updates");
      });
    });

    it("logs out and redirects to login", async () => {
      (authAPI.logout as jest.Mock).mockResolvedValue(undefined);

      render(<Navbar isLoggedIn={true} />);

      const logoutButton = screen.getAllByRole("button", {
        name: "Logout",
      })[0];

      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(authAPI.logout).toHaveBeenCalledTimes(1);
      });

      expect(mockRefresh).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  describe("when logged out", () => {
    it("renders Login instead of authenticated navigation items", () => {
      render(<Navbar isLoggedIn={false} />);

      expect(screen.getByText("TeamPulse")).toBeInTheDocument();

      expect(screen.getAllByRole("link", { name: "Members" })).toHaveLength(2);

      expect(
        screen.queryByRole("link", { name: "Actions" }),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole("link", { name: "Updates" }),
      ).not.toBeInTheDocument();

      expect(screen.getAllByRole("link", { name: "Login" })).toHaveLength(2);

      expect(
        screen.queryByRole("button", { name: "Logout" }),
      ).not.toBeInTheDocument();
    });

    it("has the correct login href", () => {
      render(<Navbar isLoggedIn={false} />);

      screen.getAllByRole("link", { name: "Login" }).forEach((link) => {
        expect(link).toHaveAttribute("href", "/login");
      });
    });
  });
});
