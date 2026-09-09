import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SignInPage from "./page";
import { authAPI } from "@/src/utils/apis/auth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/src/utils/apis/auth", () => ({
  authAPI: {
    login: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockedLogin = authAPI.login as jest.MockedFunction<typeof authAPI.login>;
const mockedToastError = toast.error as jest.MockedFunction<typeof toast.error>;

describe("SignInPage", () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseRouter.mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    } as unknown as ReturnType<typeof useRouter>);
  });

  it("renders the sign in form", () => {
    render(<SignInPage />);

    expect(
      screen.getByRole("heading", { name: /welcome back/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/sign in to manage your project/i),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /^sign in$/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /forgot password/i }),
    ).toBeInTheDocument();
  });

  it("logs in successfully and redirects to the home page", async () => {
    mockedLogin.mockResolvedValue(undefined);

    render(<SignInPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "alice@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith(
        "alice@example.com",
        "password123",
      );
    });

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/");
    });

    expect(mockedToastError).not.toHaveBeenCalled();
  });

  it("shows an error toast when login fails", async () => {
    mockedLogin.mockRejectedValue(new Error("Invalid credentials"));

    render(<SignInPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "alice@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledWith(
        "Invalid credentials! Please try again.",
      );
    });

    expect(mockRefresh).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("does not submit the form when required fields are empty", async () => {
    render(<SignInPage />);

    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockedLogin).not.toHaveBeenCalled();
    });
  });
});
