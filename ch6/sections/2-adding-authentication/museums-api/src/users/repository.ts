import { User, UserRepository } from "./types.ts";
import { generateSalt, hashWithSalt } from "./util.ts";

export class Repository implements UserRepository {
  storage = new Map<string, User>();
  async create(username: string, password: string) {
    const salt = generateSalt();
    const user = {
      createdAt: new Date(),
      username,
      hash: hashWithSalt(password, salt),
      salt,
    };

    this.storage.set(username, user);

    return user;
  }

  async exists(username: string) {
    return Boolean(this.storage.get(username));
  }

  async getByUsername(username: string) {
    const user = this.storage.get(username);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
