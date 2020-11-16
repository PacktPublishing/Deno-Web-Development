import { User, UserDto } from "./types.ts";

export const userToDto = (user: User): UserDto => {
  return {
    username: user.username,
    createdAt: user.createdAt,
  };
};
