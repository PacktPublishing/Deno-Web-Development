import { CreateUser, User, UserRepository } from "../types.ts";

export class Repository implements UserRepository {
  storage = new Map<string, User>();

  async create(user: CreateUser) {
    const userWithCreatedAt = { ...user, createdAt: new Date() };
    this.storage.set(user.username, { ...userWithCreatedAt });

    return userWithCreatedAt;
  }

  async exists(username: string) {
    return Boolean(this.storage.get(username));
  }

  async getByUsername(username: string) {
    const user = this.storage.get(username);

    return user || Promise.reject(new Error("User not found"));
  }
}
