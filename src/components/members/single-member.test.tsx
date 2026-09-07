import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import SingleMember from "./single-member";
import { useParams } from "next/navigation";
import { members } from "../../data/member";
import { memberAPI } from "@/src/apis/member";

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

jest.mock("@/src/apis/member", () => ({
  memberAPI: {
    getSingleMember: jest.fn(),
  },
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

const mockedMemberAPI = memberAPI as jest.Mocked<typeof memberAPI>;
const mockedUseParams = useParams as jest.Mock;

describe("SingleMember Component", () => {
  const mockMember = members[0];

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseParams.mockReturnValue({
      id: mockMember.id,
    });
  });

  it("renders the SkeletonLoader initially while fetching data", () => {
    mockedMemberAPI.getSingleMember.mockImplementation(
      () => new Promise(() => {}),
    );

    render(<SingleMember />);

    expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
  });

  it("fetches and renders member details successfully", async () => {
    mockedMemberAPI.getSingleMember.mockResolvedValue({
      member: mockMember,
    });

    render(<SingleMember />);

    await waitFor(() => {
      expect(screen.queryByTestId("skeleton-loader")).not.toBeInTheDocument();
    });

    expect(mockedMemberAPI.getSingleMember).toHaveBeenCalledWith(mockMember.id);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: mockMember.name,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(mockMember.role.name)).toBeInTheDocument();

    expect(screen.getByText(mockMember.timezone)).toBeInTheDocument();
  });

  it("renders the Alert component when member is not found", async () => {
    mockedMemberAPI.getSingleMember.mockResolvedValue({
      member: null,
    });

    render(<SingleMember />);

    await waitFor(() => {
      expect(screen.getByTestId("alert")).toBeInTheDocument();
    });

    expect(screen.getByText("Member not found!")).toBeInTheDocument();

    expect(
      screen.getByText("The requested member could not be found."),
    ).toBeInTheDocument();

    expect(mockedMemberAPI.getSingleMember).toHaveBeenCalledWith(mockMember.id);
  });

  it("renders the Alert component when memberAPI throws an error", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockedMemberAPI.getSingleMember.mockRejectedValue(
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
