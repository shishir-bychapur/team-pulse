import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import SingleMember from "./single-member";
import { useParams } from "next/navigation";
import { members } from "../../data/member";

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

jest.mock("../loader/skeleton-loader", () => ({
  __esModule: true,
  default: () => <div data-testid="skeleton-loader">Loading...</div>,
}));

jest.mock("../alert/alert", () => ({
  __esModule: true,
  default: ({ title, message }: { title: string; message: string }) => (
    <div data-testid="alert">
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  ),
}));

describe("SingleMember Component", () => {
  const mockMember = members[0];

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: members[0].id });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the SkeletonLoader initially while fetching data", () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<SingleMember />);

    expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
  });

  it("fetches and renders member details successfully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ member: mockMember }),
    });

    render(<SingleMember />);

    await waitFor(() => {
      expect(screen.queryByTestId("skeleton-loader")).not.toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/members/1");
    expect(
      screen.getByRole("heading", { level: 2, name: members[0].name }),
    ).toBeInTheDocument();
    expect(screen.getByText(members[0].role.name)).toBeInTheDocument();
    expect(screen.getByText(members[0].timezone)).toBeInTheDocument();
  });

  it("renders the Alert component when member is not found (null response)", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ member: null }),
    });

    render(<SingleMember />);

    await waitFor(() => {
      expect(screen.getByTestId("alert")).toBeInTheDocument();
    });

    expect(screen.getByText("Member not found!")).toBeInTheDocument();
    expect(
      screen.getByText("The requested member could not be found."),
    ).toBeInTheDocument();
  });

  it("renders the Alert component when the fetch API throws an error", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error"),
    );

    render(<SingleMember />);

    await waitFor(() => {
      expect(screen.getByTestId("alert")).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching member:",
      expect.any(Error),
    );
  });
});
