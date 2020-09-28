import { serve } from "https://deno.land/std/http/server.ts";

const PORT = 8080;
const server = serve(`:${PORT}`);

console.log('Server running at port', PORT);
for await (let req of server) {
  req.respond({ body: 'post-it api', status: 200 })
}
