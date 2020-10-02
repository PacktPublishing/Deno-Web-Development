import { Museum } from "./types.ts";

export class Repository {
  storage = new Map<string, Museum>();

  async get(id: string) {
    return this.storage.get(id);
  }

  async getAll() {
    return [...this.storage.values()];
  }
}
