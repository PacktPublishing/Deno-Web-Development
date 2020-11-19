import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.73.0/testing/asserts.ts";
import { AuthRepository } from "../deps.ts";
import { getClient } from "./client.ts";
import { createServer } from "./index.ts";

const createTestServer = (options: any = {}) => {
  return createServer({
    configuration: {
      allowedOrigins: [],
      authorization: {
        key: "key",
        algorithm: "HS256",
      },
      secure: false,
      certFile: "",
      keyFile: "",
      port: 8787,
    },
    museum: {
      getAll: async () => [],
    },
    user: {
      login: async () => ({
        user: {},
        token: "my-token",
      }),
      register: async () => ({
        user: {},
      }),
    },
    ...options,
  });
};

Deno.test("logs in", async () => {
  const server = await createTestServer({
    user: {
      login: async () => {
        return {
          user: {
            createdAt: now,
            username: "abcde",
          },
          token: "my-token",
        };
      },
    },
  });
  const now = new Date().toUTCString();

  const client = getClient({ baseURL: "http://localhost:8787" });

  const response = await client.login({ username: "abcd", password: "abcd" });
  assertEquals(response.token, "my-token", "token is right");
  assertEquals(response.user.createdAt, now, "createdAt it right");
  assertEquals(response.user.username, "abcde", "username it right");

  server.controller.abort();
});

Deno.test("registers", async () => {
  const server = await createTestServer({
    user: {
      register: async () => {
        return {
          createdAt: now,
          username: "abcde",
        };
      },
    },
  });
  const now = new Date().toUTCString();

  const client = getClient({ baseURL: "http://localhost:8787" });

  const response = await client.register(
    { username: "abcd", password: "abcd" },
  );
  assertEquals(response.user.createdAt, now, "createdAt it right");
  assertEquals(response.user.username, "abcde", "username it right");

  server.controller.abort();
});

Deno.test("throws on invalid jwt token", async () => {
  const server = await createTestServer({
    user: {
      login: async () => ({
        user: {},
        token: "my-token",
      }),
    },
  });
  const client = getClient({ baseURL: "http://localhost:8787" });
  await client.login({ username: "abcd", password: "yo" });

  try {
    await client.getMuseums();
  } catch (e) {
    assert(e, "it throws");
  }

  server.controller.abort();
});

Deno.test("works with valid jwt token", async () => {
  const testAuthRepository = new AuthRepository({
    configuration: {
      // using the same configuration as the test server jwt
      key: "key",
      algorithm: "HS256",
      tokenExpirationInSeconds: 120,
    },
  });

  const server = await createTestServer({
    user: {
      login: async ({ username }: { username: string }) => ({
        user: {},
        token: await testAuthRepository.generateToken(username),
      }),
    },
    museum: {
      getAll: async () => [{ name: "test-museum" }],
    },
  });
  const client = getClient({ baseURL: "http://localhost:8787" });
  await client.login({ username: "abcd", password: "yo" });

  const response = await client.getMuseums();
  assertEquals(response.museums.length, 1);
  assertEquals(response.museums[0].name, "test-museum");

  server.controller.abort();
});
