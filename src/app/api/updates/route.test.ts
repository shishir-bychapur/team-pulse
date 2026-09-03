import { NextRequest } from "next/server";
import { GET } from "./route";

jest.mock("@/src/data/member", () => ({
  members: [
    { id: "member-1", name: "Alice" },
    { id: "member-2", name: "Bob" },
  ],
}));

jest.mock("@/src/data/update", () => ({
  moods: ["RED", "YELLOW", "GREEN"],
  updates: [
    {
      id: "1",
      memberId: "member-1",
      mood: "GREEN",
      date: "2026-09-01",
      text: "Update 1",
    },
    {
      id: "2",
      memberId: "member-1",
      mood: "YELLOW",
      date: "2026-09-02",
      text: "Update 2",
    },
    {
      id: "3",
      memberId: "member-2",
      mood: "RED",
      date: "2026-09-01",
      text: "Update 3",
    },
  ],
}));

describe("GET /api/updates", () => {
  const baseUrl = "http://localhost:3000/api/updates";

  it("returns all updates when no filter search parameters are provided", async () => {
    const req = new NextRequest(baseUrl);
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.updates).toHaveLength(3);
  });

  it("filters updates by specific member IDs", async () => {
    const req = new NextRequest(`${baseUrl}?members=member-1`);
    const response = await GET(req);
    const data = await response.json();

    expect(data.updates).toHaveLength(2);
    expect(
      data.updates.every(
        (u: { memberId: string }) => u.memberId === "member-1",
      ),
    ).toBe(true);
  });

  it("filters updates by multiple member IDs", async () => {
    const req = new NextRequest(`${baseUrl}?members=member-1&members=member-2`);
    const response = await GET(req);
    const data = await response.json();

    expect(data.updates).toHaveLength(3);
  });

  it("filters updates by mood", async () => {
    const req = new NextRequest(`${baseUrl}?moods=RED`);
    const response = await GET(req);
    const data = await response.json();

    expect(data.updates).toHaveLength(1);
    expect(data.updates[0].mood).toBe("RED");
    expect(data.updates[0].id).toBe("3");
  });

  it("filters updates by date", async () => {
    const req = new NextRequest(`${baseUrl}?date=2026-09-01`);
    const response = await GET(req);
    const data = await response.json();

    expect(data.updates).toHaveLength(2);
    expect(
      data.updates.every((u: { date: string }) => u.date === "2026-09-01"),
    ).toBe(true);
  });

  it("combines member, mood, and date filters simultaneously", async () => {
    const req = new NextRequest(
      `${baseUrl}?members=member-1&moods=GREEN&date=2026-09-01`,
    );
    const response = await GET(req);
    const data = await response.json();

    expect(data.updates).toHaveLength(1);
    expect(data.updates[0]).toEqual({
      id: "1",
      memberId: "member-1",
      mood: "GREEN",
      date: "2026-09-01",
      text: "Update 1",
    });
  });

  it("returns an empty array if no updates match the combined filters", async () => {
    const req = new NextRequest(
      `${baseUrl}?members=member-2&moods=GREEN&date=2026-09-01`,
    );
    const response = await GET(req);
    const data = await response.json();

    expect(data.updates).toEqual([]);
  });
});
