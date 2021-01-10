import { serve } from "https://deno.land/std@0.83.0/http/server.ts";

const PORT = 8080;
const server = serve({ port: PORT });

console.log("Server running at port", PORT);
for await (const req of server) {
  req.respond({ body: "post-it api", status: 200 });
}
