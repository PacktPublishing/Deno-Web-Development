export type User = {
  username: string;
  hash: string;
  salt: string;
  createdAt: Date;
};

export type UserDto = Pick<User, "createdAt" | "username">;
export type CreateUser = Pick<User, "username" | "hash" | "salt">;

export interface UserRepository {
  create: (user: CreateUser) => Promise<User>;
  exists: (username: string) => Promise<boolean>;
}

export type RegisterPayload = { username: string; password: string };
export interface UserController {
  register: (payload: RegisterPayload) => Promise<UserDto>;
}
