import { NextRequest } from "next/server";
import { PATCH } from "./route";
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

describe("PATCH /api/actions/[id]/edit", () => {
  const baseUrl = "http://localhost:3000/api/actions/act-1/edit";

  const mockValidAction = {
    title: "Design actions",
    ownerId: "member-2",
    status: ActionStatus.OPEN,
    dueDate: "2026-09-23",
  };

  const mockParams = {
    params: Promise.resolve({ id: "act-1" }),
  };

  const invalidParams = {
    params: Promise.resolve({ id: "act-3" }),
  };

  it("returns successfully when updating an existing action", async () => {
    const req = new NextRequest(baseUrl, {
      method: "PATCH",
      body: JSON.stringify(mockValidAction),
    });
    const response = await PATCH(req, mockParams);

    expect(response.status).toBe(200);
  });

  describe("returns error when", () => {
    it("returns error when ownerId is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({ ...mockValidAction, ownerId: "-1" }),
      });
      const response = await PATCH(req, mockParams);
      expect(response.status).toBe(403);
    });

    it("returns error when title is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({ ...mockValidAction, title: "" }),
      });
      const response = await PATCH(req, mockParams);
      expect(response.status).toBe(400);
    });

    it("returns error when due date is in correct format but is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({ ...mockValidAction, dueDate: "2026-15-41" }),
      });
      const response = await PATCH(req, mockParams);
      expect(response.status).toBe(400);
    });

    it("returns error when due date is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({ ...mockValidAction, dueDate: "2026" }),
      });
      const response = await PATCH(req, mockParams);
      expect(response.status).toBe(400);
    });

    it("returns error when status is invalid", async () => {
      const req = new NextRequest(baseUrl, {
        method: "POST",
        body: JSON.stringify({ ...mockValidAction, status: "PENDING" }),
      });
      const response = await PATCH(req, mockParams);
      expect(response.status).toBe(400);
    });

    it("returns error when id doesn't exist", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/actions/act-3/edit",
        {
          method: "POST",
          body: JSON.stringify(mockValidAction),
        },
      );
      const response = await PATCH(req, invalidParams);
      expect(response.status).toBe(404);
    });
  });
});
