import { GET } from "./route";
import { updateService } from "@/src/services/update";
import { verifySession } from "@/src/utils/session";
import { Mood } from "@/generated/prisma/enums";

jest.mock("@/src/services/update", () => ({
  updateService: {
    getMoodBreakdown: jest.fn(),
  },
}));

jest.mock("@/src/utils/session", () => ({
  verifySession: jest.fn(),
}));

const mockedUpdateService = updateService as jest.Mocked<typeof updateService>;

const mockedVerifySession = jest.mocked(verifySession);

describe("GET /api/updates/moods", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedVerifySession.mockResolvedValue({
      isAuth: true,
      name: "test",
      id: "1",
    });
  });

  it("should return the mood breakdown successfully", async () => {
    const mockMoodBreakdown = [
      {
        mood: Mood.GREEN,
        _count: {
          mood: 5,
        },
      },
      {
        mood: Mood.YELLOW,
        _count: {
          mood: 3,
        },
      },
      {
        mood: Mood.RED,
        _count: {
          mood: 2,
        },
      },
    ];

    mockedUpdateService.getMoodBreakdown.mockResolvedValue(mockMoodBreakdown);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      moods: mockMoodBreakdown,
    });

    expect(mockedVerifySession).toHaveBeenCalledTimes(1);

    expect(mockedUpdateService.getMoodBreakdown).toHaveBeenCalledTimes(1);
  });

  it("should return an empty mood breakdown when there are no updates", async () => {
    mockedUpdateService.getMoodBreakdown.mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      moods: [],
    });

    expect(mockedUpdateService.getMoodBreakdown).toHaveBeenCalledTimes(1);
  });

  it("should return status 401 when the user is not authenticated", async () => {
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

    expect(mockedUpdateService.getMoodBreakdown).not.toHaveBeenCalled();
  });

  it("should return status 500 when getting the mood breakdown fails", async () => {
    mockedUpdateService.getMoodBreakdown.mockRejectedValue(
      new Error("Database error"),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);

    expect(data).toEqual({
      errors: "Something went wrong. Please try again later.",
    });

    expect(mockedUpdateService.getMoodBreakdown).toHaveBeenCalledTimes(1);
  });
});
