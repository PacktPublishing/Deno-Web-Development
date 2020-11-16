export type User = {
  username: string;
  hash: string;
  salt: string;
  createdAt: Date;
};

export type UserDto = Pick<User, "createdAt" | "username">;

export interface UserRepository {
  create: (username: string, password: string) => Promise<User>;
  exists: (username: string) => Promise<boolean>;
}

export type RegisterPayload = { username: string; password: string };
export interface UserController {
  register: (payload: RegisterPayload) => Promise<UserDto>;
}
