import { assertEquals } from "https://deno.land/std@0.73.0/testing/asserts.ts";
import { Repository as InMemoryRepository } from "./inMemory.ts";

Deno.test("it creates users correctly", async () => {
  const repository = new InMemoryRepository();

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
  const repository = new InMemoryRepository();
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
