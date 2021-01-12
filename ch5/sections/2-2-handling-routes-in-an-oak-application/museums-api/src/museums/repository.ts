import type { Museum, MuseumRepository } from "./index.ts";

export class Repository implements MuseumRepository {
  storage = new Map<string, Museum>();

  async get(id: string) {
    return this.storage.get(id);
  }

  async getAll() {
    return [...this.storage.values()];
  }
}
