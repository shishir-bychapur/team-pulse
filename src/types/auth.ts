export interface Auth {
  username: string;
  password: string;
}

export type Session = {
  username: string;
  expiresAt: Date;
};
