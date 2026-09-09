export interface Auth {
  username: string;
  password: string;
}

export type Session = {
  id: string;
  name: string;
  expiresAt: Date;
};

export type SessionPayload = {
  id: string;
  name: string;
  iat?: number;
  exp?: number;
};

export type VerifySessionResult = {
  isAuth: boolean;
  id: string | null;
  name: string | null;
};
