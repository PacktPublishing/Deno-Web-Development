import { serve } from "https://deno.land/std/http/server.ts";
import { MuseumController } from "../museums/index.ts";
import { Application } from "../deps.ts";
import { Router } from "https://deno.land/x/oak@v6.3.0/router.ts";

interface CreateServerDependencies {
  configuration: {
    port: number;
  };
  museum: MuseumController;
}

export async function createServer({
  configuration: {
    port,
  },
  museum,
}: CreateServerDependencies) {
  const app = new Application();

  app.addEventListener("listen", (e) => {
    console.log(
      `Application running at http://${e.hostname || "localhost"}:${port}`,
    );
  });

  app.addEventListener("error", (e) => {
    console.log("An error occurred", e.message);
  });

  const apiRouter = new Router({ prefix: "/api" });

  apiRouter.get("/museums", async (ctx) => {
    ctx.response.body = {
      museums: await museum.getAll(),
    };
  });

  app.use(apiRouter.routes());
  app.use(apiRouter.allowedMethods());

  app.use((ctx) => {
    ctx.response.body = "Hello World!";
  });

  await app.listen({ port });
}
