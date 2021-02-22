import { t } from "../deps.ts";
import { Controller as UserController } from "../users/index.ts";
import { Controller as MuseumController } from "../museums/index.ts";
import { createServer } from "./index.ts";

Deno.test("it responds to hello world", async () => {
  const server = await createServer({
    configuration: {
      allowedOrigins: [],
      authorization: {
        algorithm: "HS256",
        key: "abcd",
      },
      certFile: "abcd",
      keyFile: "abcd",
      port: 9001,
      secure: false,
    },
    museum: {} as MuseumController,
    user: {} as UserController,
  });

  const response = await fetch(
    "http://localhost:9001/",
    {
      method: "GET",
    },
  ).then((r) => r.text());

  t.assertEquals(
    response,
    "Hello World!",
    "responds with hello world",
  );

  server.controller.abort();
});
