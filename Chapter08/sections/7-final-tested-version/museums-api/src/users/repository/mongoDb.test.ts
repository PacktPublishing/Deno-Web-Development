import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.73.0/testing/asserts.ts";
import { Repository as MongoDbRepository } from "./mongoDb.ts";
import { Database } from "../../deps.ts";
import { User } from "../types.ts";

const mockMongoDatabase = {
  collection() {
    const storage = new Map();
    return {
      findOne: ({ username }: { username: string }) => {
        return storage.get(username);
      },
      count: async ({ username }: { username: string }) => {
        return storage.get(username) ? 1 : 0;
      },
      insertOne: async (user: User) => {
        storage.set(user.username, user);
        return user;
      },
    };
  },
} as unknown as Database;

Deno.test("it creates users correctly", async () => {
  const repository = new MongoDbRepository({ storage: mockMongoDatabase });

  const createdUser = await repository.create({
    hash: "abcd",
    salt: "yo",
    username: "test",
  });

  assertEquals(createdUser.hash, "abcd");
  assertEquals(createdUser.salt, "yo");
  assertEquals(createdUser.username, "test");
});

Deno.test("it gets a single user correctly", async () => {
  const repository = new MongoDbRepository({ storage: mockMongoDatabase });
  await repository.create({
    hash: "abcd",
    salt: "yo",
    username: "test",
  });

  const getUser = await repository.getByUsername("test");

  assertEquals(getUser.hash, "abcd");
  assertEquals(getUser.salt, "yo");
  assertEquals(getUser.username, "test");
});

Deno.test("it checks for existance of a username", async () => {
  const repository = new MongoDbRepository({ storage: mockMongoDatabase });
  await repository.create({
    hash: "abcd",
    salt: "yo",
    username: "test",
  });

  assert(await repository.exists("test"), "user exists");
  assert(!await repository.exists("non-existant"), "user does not exist");
});
