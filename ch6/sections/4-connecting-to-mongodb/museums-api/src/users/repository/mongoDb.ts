import { User, UserRepository } from "../types.ts";
import { generateSalt, hashWithSalt } from "../util.ts";
import { Database, Collection } from '../../deps.ts';

interface RepositoryDependencies {
  storage: Database,
  configuration: {
    collectionName: 'users'
  }
}

export class Repository implements UserRepository {
  storage: Collection<User>

  constructor({ storage, configuration }: RepositoryDependencies) {
    this.storage = storage.collection<User>(configuration.collectionName);
  }

  async create(username: string, password: string) {
    const salt = generateSalt();
    const user = {
      createdAt: new Date(),
      username,
      hash: hashWithSalt(password, salt),
      salt
    }

    this.storage.insertOne({ ...user })

    return user;
  }

  async exists(username: string) {
    return Boolean(await this.storage.findOne({ username }));
  }

  async getByUsername(username: string) {
    const user = await this.storage.findOne({ username });

    return user || Promise.reject(new Error('User not found'));
  }
}
