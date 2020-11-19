import { serve } from "https://deno.land/std/http/server.ts";

const PORT = 8080;
const HOST = "http://localhost";
const server = serve(`:${PORT}`);

console.log(`Server running at ${HOST}:${PORT}`);
for await (let req of server) {
  const url = new URL(`${HOST}${req.url}`);

  req.respond({ body: "post-it api", status: 200 });
}
