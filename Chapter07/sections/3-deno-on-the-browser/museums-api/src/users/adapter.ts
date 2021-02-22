import type { User, UserDto } from "./types.ts";

export const userToUserDto = (user: User): UserDto => {
  return {
    username: user.username,
    createdAt: user.createdAt,
  };
};
