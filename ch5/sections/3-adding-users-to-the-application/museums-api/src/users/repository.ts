import type { CreateUser, User, UserRepository } from "./index.ts";

export class Repository implements UserRepository {
  private storage = new Map<User["username"], User>();

  async create(user: CreateUser) {
    const userWithCreatedAt = { ...user, createdAt: new Date() };
    this.storage.set(user.username, { ...userWithCreatedAt });

    return userWithCreatedAt;
  }

  async exists(username: string) {
    return Boolean(this.storage.get(username));
  }
}
