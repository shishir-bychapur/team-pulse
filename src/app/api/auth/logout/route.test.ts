import { NextRequest } from "next/server";
import { GET } from "./route";
import { authService } from "@/src/services/auth";

jest.mock("@/src/services/auth", () => ({
  authService: {
    logout: jest.fn(),
  },
}));

describe("GET /auth/logout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call authService.logout", async () => {
    (authService.logout as jest.Mock).mockResolvedValue(undefined);

    const req = new NextRequest("http://localhost:3000/api/auth/logout", {
      method: "GET",
    });

    await GET(req);

    expect(authService.logout).toHaveBeenCalledTimes(1);
  });

  it("should return 200 after logging out", async () => {
    (authService.logout as jest.Mock).mockResolvedValue(undefined);

    const req = new NextRequest("http://localhost:3000/api/auth/logout", {
      method: "GET",
    });

    const response = await GET(req);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({});
  });
});
