import { serve } from "http/server.ts";
for await (const req of serve(":8080")) {
  req.respond({ body: "Hello deno" });
  debugger;
}
