import { JWTPayload } from "jose";

export interface Auth {
  username: string;
  password: string;
}

export type Session = {
  username: string;
  expiresAt: Date;
};

export type SessionPayload = JWTPayload & {
  username: string;
};

export type VerifySessionResult = {
  isAuth: boolean;
  username: string | null;
};
