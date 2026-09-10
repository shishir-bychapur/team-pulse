import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";
import { Session, SessionPayload, VerifySessionResult } from "../types/auth";

const secretKey = process.env.SESSION_SECRET;

if (!secretKey) {
  throw new Error("SESSION_SECRET is not defined");
}

const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Session): Promise<string> {
  return new SignJWT({
    id: payload.id,
    name: payload.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = "",
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    if (typeof payload.id !== "string" || typeof payload.name !== "string") {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(id: string, name: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await encrypt({
    id,
    name,
    expiresAt,
  });

  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

export const verifySession = cache(async (): Promise<VerifySessionResult> => {
  const cookie = (await cookies()).get("session")?.value;

  const session = await decrypt(cookie);

  if (!session) {
    return {
      isAuth: false,
      id: null,
      name: null,
    };
  }

  return {
    isAuth: true,
    id: session.id,
    name: session.name,
  };
});
