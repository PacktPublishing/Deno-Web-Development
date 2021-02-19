import { t } from "../deps.ts";
import { AuthRepository } from "../deps.ts";
import { getClient } from "../client/index.ts";
import { createServer, CreateServerDependencies } from "./index.ts";

const createTestServer = (options?: CreateServerDependencies) => {
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
  t.assertEquals(response.token, "my-token", "token is right");
  t.assertEquals(response.user.createdAt, now, "createdAt it right");
  t.assertEquals(response.user.username, "abcde", "username it right");

  server.controller.abort();
});

Deno.test("registers", async () => {
  const server = await createTestServer({
    user: {
      register: async () => {
        return {
          user: {
            createdAt: now,
            username: "abcde",
          },
        };
      },
    },
  });
  const now = new Date().toUTCString();

  const client = getClient({ baseURL: "http://localhost:8787" });

  const response = await client.register(
    { username: "abcd", password: "abcd" },
  );
  t.assertEquals(response.user.createdAt, now, "createdAt it right");
  t.assertEquals(response.user.username, "abcde", "username it right");

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
    t.assert(e, "it throws");
  } finally {
    server.controller.abort();
  }
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
  t.assertEquals(response.museums.length, 1);
  t.assertEquals(response.museums[0].name, "test-museum");

  server.controller.abort();
});
