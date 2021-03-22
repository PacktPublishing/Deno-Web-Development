import { MuseumController } from "../museums/index.ts";
import { Application, Router } from "../deps.ts";
import { UserController } from "../users/types.ts";

interface CreateServerDependencies {
  configuration: {
    port: number;
  };
  museum: MuseumController;
  user: UserController;
}

export async function createServer({
  configuration: {
    port,
  },
  museum,
  user,
}: CreateServerDependencies) {
  const app = new Application();

  app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
  });
  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
  });

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

  apiRouter.post("/users/register", async (ctx) => {
    const { username, password } = await ctx.request.body({ type: "json" })
      .value;

    if (!username || !password) {
      ctx.response.status = 400;

      return;
    }

    try {
      const createdUser = await user.register({ username, password });

      ctx.response.status = 201;
      ctx.response.body = { user: createdUser };
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: e.message };
    }
  });

  apiRouter.post("/login", async (ctx) => {
    const { username, password } = await ctx.request.body().value;
    try {
      const { user: loginUser } = await user.login({ username, password });
      ctx.response.body = { user: loginUser };
      ctx.response.status = 201;
    } catch (e) {
      ctx.response.body = { message: e.message };
      ctx.response.status = 400;
    }
  });

  app.use(apiRouter.routes());
  app.use(apiRouter.allowedMethods());

  app.use((ctx) => {
    ctx.response.body = "Hello World!";
  });

  await app.listen({ port });
}
