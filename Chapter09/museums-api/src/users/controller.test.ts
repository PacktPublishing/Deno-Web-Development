import {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
} from "https://deno.land/std@0.73.0/testing/asserts.ts";
import { Controller } from "./controller.ts";
import { Repository as InMemoryRepository } from "./repository/inMemory.ts";
import { AuthRepository } from "../deps.ts";

Deno.test("it tries to create a user", async () => {
  const controller = new Controller({
    authRepository: new AuthRepository(
      {
        configuration: {
          tokenExpirationInSeconds: 120,
          key: "abcd",
          algorithm: "HS256",
        },
      },
    ),
    userRepository: new InMemoryRepository(),
  });

  const createdUser = await controller.register({
    password: "test-pw",
    username: "test-username",
  });

  assertEquals(createdUser.username, "test-username");
});

Deno.test("it logs in with a username and password after creation", async () => {
  const controller = new Controller({
    authRepository: new AuthRepository(
      {
        configuration: {
          tokenExpirationInSeconds: 120,
          key: "abcd",
          algorithm: "HS256",
        },
      },
    ),
    userRepository: new InMemoryRepository(),
  });
  await controller.register({
    password: "test-pw",
    username: "test-username",
  });

  const authenticatedUser = await controller.login({
    password: "test-pw",
    username: "test-username",
  });

  assertEquals(authenticatedUser.user.username, "test-username");
  assert(!!authenticatedUser.token);
});

Deno.test("it throws when trying to log in with an inexistent user", async () => {
  const controller = new Controller({
    authRepository: new AuthRepository(
      {
        configuration: {
          tokenExpirationInSeconds: 120,
          key: "abcd",
          algorithm: "HS256",
        },
      },
    ),
    userRepository: new InMemoryRepository(),
  });

  assertThrowsAsync(async () => {
    return controller.login({ password: "password", username: "username" });
  });
});

Deno.test("it throws when trying to log in with a wrong password", async () => {
  const controller = new Controller({
    authRepository: new AuthRepository(
      {
        configuration: {
          tokenExpirationInSeconds: 120,
          key: "abcd",
          algorithm: "HS256",
        },
      },
    ),
    userRepository: new InMemoryRepository(),
  });

  await controller.register({
    password: "test-pw",
    username: "test-username",
  });

  assertThrowsAsync(async () => {
    return controller.login({ password: "password", username: "username" });
  });
});
