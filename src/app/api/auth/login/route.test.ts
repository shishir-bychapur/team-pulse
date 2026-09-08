import { POST } from "./route";
import { authService } from "@/src/services/auth";
import { NextRequest } from "next/server";

jest.mock("@/src/services/auth", () => ({
  authService: {
    login: jest.fn(),
  },
}));

describe("POST /auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createRequest = (body: unknown) =>
    new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

  it("should return 400 when the request body is invalid", async () => {
    const req = createRequest({
      username: "",
      password: "",
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("errors");

    expect(authService.login).not.toHaveBeenCalled();
  });

  it("should call authService.login with valid credentials", async () => {
    (authService.login as jest.Mock).mockResolvedValue(undefined);

    const req = createRequest({
      username: "test@example.com",
      password: "password123",
    });

    await POST(req);

    expect(authService.login).toHaveBeenCalledTimes(1);

    expect(authService.login).toHaveBeenCalledWith(
      "test@example.com",
      "password123",
    );
  });

  it("should return 200 when login is successful", async () => {
    (authService.login as jest.Mock).mockResolvedValue(undefined);

    const req = createRequest({
      username: "test@example.com",
      password: "password123",
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
  });
});
