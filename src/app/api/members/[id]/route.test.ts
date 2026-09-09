import { NextRequest } from "next/server";
import { GET } from "./route";
import { memberService } from "@/src/services/member";
import { MemberWithRole } from "@/src/types/member";

jest.mock("@/src/services/member", () => ({
  memberService: {
    getMember: jest.fn(),
  },
}));

const mockedMemberService = memberService as jest.Mocked<typeof memberService>;

describe("GET /api/members/[id]", () => {
  const baseUrl = "http://localhost:3000/api/members";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return status 200 and member details when member exists", async () => {
    const mockMember: MemberWithRole = {
      id: "1",
      name: "Tom",
      timezone: "America/New_York",
      role: {
        id: "r1",
        name: "Developer",
      },
      roleId: "r1",
      email: "tom@email.com",
    };

    mockedMemberService.getMember.mockResolvedValue(mockMember);

    const req = new NextRequest(`${baseUrl}/1`);
    const params = Promise.resolve({ id: "1" });

    const response = await GET(req, { params });
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toEqual({
      member: mockMember,
    });

    expect(mockedMemberService.getMember).toHaveBeenCalledWith("1");

    expect(mockedMemberService.getMember).toHaveBeenCalledTimes(1);
  });

  it("should return status 404 and null when member is not found", async () => {
    mockedMemberService.getMember.mockResolvedValue(null);

    const req = new NextRequest(`${baseUrl}/non-existent-id`);

    const params = Promise.resolve({
      id: "non-existent-id",
    });

    const response = await GET(req, { params });
    const data = await response.json();

    expect(response.status).toBe(404);

    expect(data).toEqual({
      member: null,
    });

    expect(mockedMemberService.getMember).toHaveBeenCalledWith(
      "non-existent-id",
    );

    expect(mockedMemberService.getMember).toHaveBeenCalledTimes(1);
  });

  it("should return status 500 when getting the member fails", async () => {
    mockedMemberService.getMember.mockRejectedValue(
      new Error("Database error"),
    );

    const req = new NextRequest(`${baseUrl}/1`);
    const params = Promise.resolve({ id: "1" });

    const response = await GET(req, { params });
    const data = await response.json();

    expect(response.status).toBe(500);

    expect(data).toEqual({
      errors: "Something went wrong. Please try again later.",
    });

    expect(mockedMemberService.getMember).toHaveBeenCalledWith("1");

    expect(mockedMemberService.getMember).toHaveBeenCalledTimes(1);
  });
});
