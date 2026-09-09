import { GET } from "./route";
import { memberService } from "@/src/services/member";
import { MemberWithRole } from "@/src/types/member";

jest.mock("@/src/services/member", () => ({
  memberService: {
    getMembers: jest.fn(),
  },
}));

const mockedMemberService = memberService as jest.Mocked<typeof memberService>;

describe("GET /api/members", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all members successfully", async () => {
    const mockMembers: MemberWithRole[] = [
      {
        id: "1",
        name: "Tom",
        timezone: "America/New_York",
        role: {
          id: "r1",
          name: "Developer",
        },
        roleId: "r1",
        email: "tom@email.com",
      },
      {
        id: "2",
        name: "Harry",
        timezone: "Europe/London",
        role: {
          id: "r2",
          name: "Designer",
        },
        roleId: "r2",
        email: "harry@email.com",
      },
    ];

    mockedMemberService.getMembers.mockResolvedValue(mockMembers);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      members: mockMembers,
    });

    expect(mockedMemberService.getMembers).toHaveBeenCalledTimes(1);
  });

  it("should return an empty array when there are no members", async () => {
    mockedMemberService.getMembers.mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      members: [],
    });

    expect(mockedMemberService.getMembers).toHaveBeenCalledTimes(1);
  });

  it("should return status 500 when getting members fails", async () => {
    mockedMemberService.getMembers.mockRejectedValue(
      new Error("Database error"),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);

    expect(data).toEqual({
      errors: "Something went wrong. Please try again later.",
    });

    expect(mockedMemberService.getMembers).toHaveBeenCalledTimes(1);
  });
});
