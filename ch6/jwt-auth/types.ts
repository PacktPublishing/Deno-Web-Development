import { Algorithm } from "./deps.ts";

export type { Algorithm };

export type Configuration = {
  key: string;
  algorithm: Algorithm;
  tokenExpirationInSeconds: number;
};

export interface AuthRepository {
  getToken: (username: string) => Promise<string>;
  generateToken: (username: string) => Promise<string>;
}
