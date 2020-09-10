import { serve } from "./deps.js";
for await (const req of serve(":8080")) {
  req.respond({ body: "Hello deno" });
}
