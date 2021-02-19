import { assertEquals } from "https://deno.land/std@0.73.0/testing/asserts.ts";
import {
  serve,
  ServerRequest,
} from "https://deno.land/std@0.72.0/http/server.ts";
import { getClient } from "./client.ts";

const getJsonBody = async (req: ServerRequest) => {
  try {
    const td = new TextDecoder();
    const body = JSON.parse(td.decode(await Deno.readAll(req.body)));

    return body;
  } catch (e) {
    return {};
  }
};

async function createWebServerAndHandle(addr: string) {
  return {
    handle: async function (
      handler: (
        req: ServerRequest,
        body: { json?: any },
      ) => void | Promise<void>,
    ): Promise<void> {
      const server = serve(addr);
      for await (const req of server) {
        await handler(req, { json: await getJsonBody(req) });
        server.close();
      }
    },
    respondWith: async function (responseBody: any) {
      const server = serve(addr);
      for await (const req of server) {
        await req.respond({
          body: JSON.stringify(responseBody),
        });
        server.close();
      }
    },
  };
}

Deno.test("it does a POST request to /api/users/register", async () => {
  const now = new Date().toISOString();
  const { respondWith } = await createWebServerAndHandle("localhost:8765");

  const client = getClient({ baseURL: "http://localhost:8765" });

  const request = client.register({ username: "abcd", password: "123" });
  respondWith({
    user: {
      username: "abcd",
      createdAt: now,
    },
  });

  const response = await request;
  assertEquals(response.user.username, "abcd");
  assertEquals(response.user.createdAt, now);
});

Deno.test("it does a POST request to /api/login", async () => {
  const now = new Date().toISOString();
  const { handle } = await createWebServerAndHandle("localhost:8765");

  const client = getClient({ baseURL: "http://localhost:8765" });

  handle(async (req, { json }) => {
    assertEquals(json?.username, "username", "sends the right username");
    assertEquals(json?.password, "password", "sends the right password");

    return req.respond({
      body: JSON.stringify({
        user: {
          username: "username",
          createdAt: now,
        },
      }),
    });
  });
  const response = await client.login(
    { username: "username", password: "password" },
  );

  assertEquals(response.user.username, "username");
  assertEquals(response.user.createdAt, now);
});

Deno.test("it does a GET request to /api/museums", async () => {
  const now = new Date().toISOString();
  const { respondWith } = await createWebServerAndHandle("localhost:8765");

  const client = getClient({ baseURL: "http://localhost:8765" });

  respondWith({
    museums: [
      { name: "amazing" },
      { name: "the-best" },
    ],
  });
  const response = await client.getMuseums();

  assertEquals(response.museums[0].name, "amazing");
  assertEquals(response.museums[1].name, "the-best");
});

Deno.test("it does a GET request to /api/museums with authorization headers", async () => {
  const now = new Date().toISOString();
  const { handle, respondWith } = await createWebServerAndHandle(
    "localhost:8765",
  );

  const client = getClient({ baseURL: "http://localhost:8765" });

  respondWith({
    user: {},
    token: "my-token",
  });
  await client.login({ username: "yo", password: "yo" });

  handle(async (req) => {
    assertEquals(
      req.headers.get("authorization"),
      "Bearer my-token",
      "send the correct token",
    );

    return req.respond({ status: 200, body: "{}" });
  });
  await client.getMuseums();
});
