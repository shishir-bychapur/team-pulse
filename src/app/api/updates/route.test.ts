import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { Mood } from "@/src/types/update";

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

describe("POST /api/updates", () => {
  const baseUrl = "http://localhost:3000/api/updates";

  const mockValidUpdate = {
    memberId: "member-1",
    date: "2026-09-01",
    text: "Worked on next.js routing.",
    mood: Mood.RED,
  };

  it("returns successfully when creating new update", async () => {
    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(mockValidUpdate),
    });
    const response = await POST(req);

    expect(response.status).toBe(200);
  });

  describe("returns error when", () => {
    it("returns error when memberId is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({ ...mockValidUpdate, memberId: "-1" }),
      });
      const response = await POST(req);
      expect(response.status).toBe(403);
    });

    it("returns error when date is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({ ...mockValidUpdate, date: "-1" }),
      });
      const response = await POST(req);
      expect(response.status).toBe(400);
    });

    it("returns error when date is in correct format but is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({ ...mockValidUpdate, date: "2026-15-41" }),
      });
      const response = await POST(req);
      expect(response.status).toBe(400);
    });

    it("returns error when text is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({ ...mockValidUpdate, text: "" }),
      });
      const response = await POST(req);
      expect(response.status).toBe(400);
    });

    it("returns error when mood is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({ ...mockValidUpdate, mood: "WHITE" }),
      });
      const response = await POST(req);
      expect(response.status).toBe(400);
    });
  });
});
