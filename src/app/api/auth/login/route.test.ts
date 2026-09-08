import { POST } from "./route";
import { authService } from "@/src/services/auth";
import { verifySession } from "@/src/utils/session";
import { NextRequest } from "next/server";

jest.mock("@/src/services/auth", () => ({
  authService: {
    login: jest.fn(),
  },
}));

jest.mock("@/src/utils/session", () => ({
  verifySession: jest.fn(),
}));

const mockedVerifySession = jest.mocked(verifySession);

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
    mockedVerifySession.mockResolvedValue({
      isAuth: false,
      username: null,
    });
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
    mockedVerifySession.mockResolvedValue({
      isAuth: false,
      username: null,
    });
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
    mockedVerifySession.mockResolvedValue({
      isAuth: false,
      username: null,
    });
    (authService.login as jest.Mock).mockResolvedValue(undefined);

    const req = createRequest({
      username: "test@example.com",
      password: "password123",
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
  });

  it("should return 403 when the user is already logged in", async () => {
    mockedVerifySession.mockResolvedValue({
      isAuth: true,
      username: "test@test.com",
    });
    const req = createRequest({
      username: "test@example.com",
      password: "password123",
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("errors");

    expect(authService.login).not.toHaveBeenCalled();
  });
});
