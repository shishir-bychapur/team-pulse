import { GET } from "./route";
import { authService } from "@/src/services/auth";
import { verifySession } from "@/src/utils/session";

jest.mock("@/src/services/auth", () => ({
  authService: {
    logout: jest.fn(),
  },
}));

jest.mock("@/src/utils/session", () => ({
  verifySession: jest.fn(),
}));

const mockedVerifySession = jest.mocked(verifySession);

const mockedAuthService = authService as jest.Mocked<typeof authService>;

describe("GET /api/auth/logout", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedVerifySession.mockResolvedValue({
      isAuth: true,
      name: "Test User",
      id: "member-1",
    });
  });

  it("should call authService.logout", async () => {
    mockedAuthService.logout.mockResolvedValue(undefined);

    await GET();

    expect(mockedAuthService.logout).toHaveBeenCalledTimes(1);
  });

  it("should return 200 after logging out successfully", async () => {
    mockedAuthService.logout.mockResolvedValue(undefined);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({});

    expect(mockedAuthService.logout).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if the user is not logged in", async () => {
    mockedVerifySession.mockResolvedValue({
      isAuth: false,
      name: null,
      id: null,
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);

    expect(data).toEqual({
      errors: "Unauthorized. Please log in.",
    });

    expect(mockedAuthService.logout).not.toHaveBeenCalled();
  });

  it("should return 500 when logout fails", async () => {
    mockedAuthService.logout.mockRejectedValue(
      new Error("Session deletion failed"),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);

    expect(data).toEqual({
      errors: "Something went wrong. Please try again later.",
    });

    expect(mockedAuthService.logout).toHaveBeenCalledTimes(1);
  });
});
