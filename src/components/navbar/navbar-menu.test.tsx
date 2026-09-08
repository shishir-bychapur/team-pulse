import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { verifySession } from "@/src/utils/session";
import { NavbarMenu } from "./navbar-menu";

jest.mock("@/src/utils/session", () => ({
  verifySession: jest.fn(),
}));

jest.mock("./navbar", () => ({
  __esModule: true,
  default: ({ isLoggedIn }: { isLoggedIn: boolean }) => (
    <div data-testid="navbar">{isLoggedIn ? "Logged In" : "Logged Out"}</div>
  ),
}));

describe("NavbarMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Navbar with isLoggedIn as true when session is authenticated", async () => {
    (verifySession as jest.Mock).mockResolvedValue({
      isAuth: true,
    });

    const component = await NavbarMenu();

    render(component);

    expect(verifySession).toHaveBeenCalledTimes(1);

    expect(screen.getByTestId("navbar")).toHaveTextContent("Logged In");
  });

  it("renders Navbar with isLoggedIn as false when there is no authenticated session", async () => {
    (verifySession as jest.Mock).mockResolvedValue({
      isAuth: false,
    });

    const component = await NavbarMenu();

    render(component);

    expect(verifySession).toHaveBeenCalledTimes(1);

    expect(screen.getByTestId("navbar")).toHaveTextContent("Logged Out");
  });

  it("renders Navbar as logged out when session is undefined", async () => {
    (verifySession as jest.Mock).mockResolvedValue(undefined);

    const component = await NavbarMenu();

    render(component);

    expect(verifySession).toHaveBeenCalledTimes(1);

    expect(screen.getByTestId("navbar")).toHaveTextContent("Logged Out");
  });
});
