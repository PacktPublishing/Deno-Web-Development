import { serve } from "https://deno.land/std@0.83.0/http/server.ts";

const PORT = 8080;
const HOST = "localhost";
const PROTOCOL = "http";
const server = serve({ port: PORT, hostname: HOST });

console.log(`Server running at ${HOST}:${PORT}`);
for await (const req of server) {
  const url = new URL(`${PROTOCOL}://${HOST}${req.url}`);

  const pathWithMethod = `${req.method} ${url.pathname}`;
  switch (pathWithMethod) {
    case "GET /api/post-its":
      req.respond({ body: "list of all the post-its", status: 200 });
      continue;
    default:
      req.respond({ status: 404 });
  }
}
