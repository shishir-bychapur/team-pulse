import { NextRequest } from "next/server";
import { GET } from "./route";

jest.mock("@/src/data/member", () => ({
  members: [
    {
      id: "1",
      name: "Tom",
      timezone: "America/New_York",
      role: { id: "r1", name: "Developer" },
    },
    {
      id: "2",
      name: "Harry",
      timezone: "Europe/London",
      role: { id: "r2", name: "Designer" },
    },
  ],
}));

describe("GET /api/members/[id]", () => {
  const baseUrl = "http://localhost:3000/api/members";

  it("returns status 200 and member details when member exists", async () => {
    const req = new NextRequest(`${baseUrl}/1`);
    const params = Promise.resolve({ id: "1" });

    const response = await GET(req, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.member).toEqual({
      id: "1",
      name: "Tom",
      timezone: "America/New_York",
      role: { id: "r1", name: "Developer" },
    });
  });

  it("returns status 404 and null when member is not found", async () => {
    const req = new NextRequest(`${baseUrl}/non-existent-id`);
    const params = Promise.resolve({ id: "non-existent-id" });

    const response = await GET(req, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.member).toBeNull();
  });
});
