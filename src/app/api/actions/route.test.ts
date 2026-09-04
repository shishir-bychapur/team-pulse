import { NextRequest } from "next/server";
import { GET } from "./route";

jest.mock("@/src/data/action", () => ({
  actionItems: [
    {
      id: "act-1",
      title: "Setup pipeline",
      ownerId: "1",
      status: "Open",
      dueDate: "2026-09-15",
    },
    {
      id: "act-1",
      title: "Design wireframes",
      ownerId: "2",
      status: "Closed",
      dueDate: "2026-09-13",
    },
  ],
}));

describe("GET /api/actions", () => {
  const baseUrl = "http://localhost:3000/api/actions";

  it("returns all actions", async () => {
    const req = new NextRequest(baseUrl);
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.actions).toHaveLength(2);
  });
});
