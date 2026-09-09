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

const mockedAuthService = authService as jest.Mocked<typeof authService>;

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedVerifySession.mockResolvedValue({
      isAuth: false,
      name: null,
      id: null,
    });
  });

  const createRequest = (body: unknown) =>
    new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

  describe("Successful Login", () => {
    it("should call authService.login with valid credentials", async () => {
      mockedAuthService.login.mockResolvedValue();

      const req = createRequest({
        username: "test@example.com",
        password: "password123",
      });

      await POST(req);

      expect(mockedAuthService.login).toHaveBeenCalledTimes(1);

      expect(mockedAuthService.login).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );
    });

    it("should return 200 when login is successful", async () => {
      mockedAuthService.login.mockResolvedValue();

      const req = createRequest({
        username: "test@example.com",
        password: "password123",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);

      expect(data).toEqual({});
    });
  });

  describe("Authentication", () => {
    it("should return 403 when the user is already logged in", async () => {
      mockedVerifySession.mockResolvedValue({
        isAuth: true,
        name: "Test User",
        id: "member-1",
      });

      const req = createRequest({
        username: "test@example.com",
        password: "password123",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(403);

      expect(data).toEqual({
        errors: "You are already logged in.",
      });

      expect(mockedAuthService.login).not.toHaveBeenCalled();
    });
  });

  describe("Validation", () => {
    it("should return 400 when username and password are invalid", async () => {
      const req = createRequest({
        username: "",
        password: "",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);

      expect(data.errors).toBeDefined();

      expect(mockedAuthService.login).not.toHaveBeenCalled();
    });

    it("should return 400 when username is missing", async () => {
      const req = createRequest({
        password: "password123",
      });

      const response = await POST(req);

      expect(response.status).toBe(400);

      expect(mockedAuthService.login).not.toHaveBeenCalled();
    });

    it("should return 400 when password is missing", async () => {
      const req = createRequest({
        username: "test@example.com",
      });

      const response = await POST(req);

      expect(response.status).toBe(400);

      expect(mockedAuthService.login).not.toHaveBeenCalled();
    });
  });

  describe("Server Error", () => {
    it("should return 500 when login fails unexpectedly", async () => {
      mockedAuthService.login.mockRejectedValue(new Error("Database error"));

      const req = createRequest({
        username: "test@example.com",
        password: "password123",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);

      expect(data).toEqual({
        errors: "Something went wrong. Please try again later.",
      });

      expect(mockedAuthService.login).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );

      expect(mockedAuthService.login).toHaveBeenCalledTimes(1);
    });
  });
});
