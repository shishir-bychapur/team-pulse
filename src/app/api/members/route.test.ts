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

describe("GET /api/members", () => {
  const baseUrl = "http://localhost:3000/api/members";

  it("returns all members", async () => {
    const req = new NextRequest(baseUrl);
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.members).toHaveLength(2);
    expect(data.members).toEqual([
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
    ]);
  });
});
