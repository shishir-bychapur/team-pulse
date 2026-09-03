import { NextRequest } from "next/server";
import { POST } from "./route";
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

describe("POST /api/updates/new", () => {
  const baseUrl = "http://localhost:3000/api/updates/new";

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
