import { serve } from "https://deno.land/std/http/server.ts";

const PORT = 8080;
const HOST = "http://0.0.0.0";
const server = serve(`:${PORT}`);

console.log(`Server running at ${HOST}:${PORT}`);
for await (let req of server) {
  const url = new URL(`${HOST}${req.url}`);

  const pathWithMethod = `${req.method} ${url.pathname}`;
  switch (pathWithMethod) {
    case "GET /api/post-its":
      req.respond({ body: "list of all the post-its", status: 200 });
      continue;
    default:
      req.respond({ status: 404 });
  }
}
