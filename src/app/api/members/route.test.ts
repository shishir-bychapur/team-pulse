import { NextRequest } from "next/server";
import { GET } from "./route";
import { memberService } from "@/src/services/member";
import { Member } from "@/src/types/member";

jest.mock("@/src/services/member", () => ({
  memberService: {
    getMembers: jest.fn(),
  },
}));

const mockedMemberService = memberService as jest.Mocked<typeof memberService>;

describe("GET /api/members", () => {
  const baseUrl = "http://localhost:3000/api/members";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all members successfully", async () => {
    const mockMembers: Member[] = [
      {
        id: "1",
        name: "Tom",
        timezone: "America/New_York",
        role: {
          id: "r1",
          name: "Developer",
        },
      },
      {
        id: "2",
        name: "Harry",
        timezone: "Europe/London",
        role: {
          id: "r2",
          name: "Designer",
        },
      },
    ];

    mockedMemberService.getMembers.mockReturnValue(mockMembers);

    const req = new NextRequest(baseUrl);

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      members: mockMembers,
    });

    expect(mockedMemberService.getMembers).toHaveBeenCalledTimes(1);
  });

  it("should return an empty array when there are no members", async () => {
    mockedMemberService.getMembers.mockReturnValue([]);

    const req = new NextRequest(baseUrl);

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      members: [],
    });

    expect(mockedMemberService.getMembers).toHaveBeenCalledTimes(1);
  });
});
