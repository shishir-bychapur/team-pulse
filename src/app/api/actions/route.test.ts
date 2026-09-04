import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { ActionStatus } from "@/src/types/action";

jest.mock("@/src/data/member", () => ({
  members: [
    { id: "member-1", name: "Alice" },
    { id: "member-2", name: "Bob" },
  ],
}));

jest.mock("@/src/data/action", () => ({
  actionItems: [
    {
      id: "act-1",
      title: "Setup CI pipeline",
      ownerId: "member-1",
      status: "Open",
      dueDate: "2026-09-17",
    },
    {
      id: "act-2",
      title: "Design dashboard",
      ownerId: "member-2",
      status: "Closed",
      dueDate: "2026-09-21",
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

describe("POST /api/actions", () => {
  const baseUrl = "http://localhost:3000/api/actions";

  const mockValidAction = {
    title: "Design actions",
    ownerId: "member-2",
    status: ActionStatus.OPEN,
    dueDate: "2026-09-23",
  };

  it("returns successfully when creating new action", async () => {
    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify(mockValidAction),
    });
    const response = await POST(req);

    expect(response.status).toBe(200);
  });

  describe("returns error when", () => {
    it("returns error when ownerId is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({ ...mockValidAction, ownerId: "-1" }),
      });
      const response = await POST(req);
      expect(response.status).toBe(403);
    });

    it("returns error when title is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({ ...mockValidAction, title: "" }),
      });
      const response = await POST(req);
      expect(response.status).toBe(400);
    });

    it("returns error when due date is in correct format but is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({ ...mockValidAction, dueDate: "2026-15-41" }),
      });
      const response = await POST(req);
      expect(response.status).toBe(400);
    });

    it("returns error when due date is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({ ...mockValidAction, dueDate: "2026" }),
      });
      const response = await POST(req);
      expect(response.status).toBe(400);
    });

    it("returns error when status is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({ ...mockValidAction, status: "PENDING" }),
      });
      const response = await POST(req);
      expect(response.status).toBe(400);
    });
  });
});
