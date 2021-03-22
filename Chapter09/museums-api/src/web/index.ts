import { MuseumController } from "../museums/index.ts";
import {
  AlgorithmInput,
  Application,
  jwtMiddleware,
  oakCors,
  Router,
} from "../deps.ts";
import { UserController } from "../users/types.ts";

export interface CreateServerDependencies {
  configuration: {
    port: number;
    authorization: {
      key: string;
      algorithm: AlgorithmInput;
    };
    allowedOrigins: string[];
    secure: boolean;
    keyFile: string;
    certFile: string;
  };
  museum: MuseumController;
  user: UserController;
}

export { getClient } from "../client/index.ts";
export async function createServer({
  configuration: {
    port,
    authorization,
    allowedOrigins,
    secure,
    keyFile,
    certFile,
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

  app.use(
    oakCors({ origin: allowedOrigins }),
  );

  app.addEventListener("listen", (e) => {
    console.log(
      `Application running at ${e.secure ? "https" : "http"}://${e.hostname ||
        "localhost"}:${port}`,
    );
  });

  app.addEventListener("error", (e) => {
    console.log("An error occurred", e.message);
  });

  const apiRouter = new Router({ prefix: "/api" });

  apiRouter.get("/client.js", async (ctx) => {
    const {
      diagnostics,
      files,
    } = await Deno.emit(
      "./src/client/index.ts",
      { bundle: "esm" },
    );

    if (!diagnostics.length) {
      ctx.response.type = "application/javascript";
      ctx.response.body = files["deno:///bundle.js"];

      return;
    }
  });

  const authenticated = jwtMiddleware(
    { algorithm: authorization.algorithm, key: authorization.key },
  );
  apiRouter.get("/museums", authenticated, async (ctx) => {
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
      const { user: loginUser, token } = await user.login(
        { username, password },
      );
      ctx.response.body = { user: loginUser, token };
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

  const controller = new AbortController();
  const { signal } = controller;

  app.listen({
    port,
    secure,
    keyFile,
    certFile,
    signal,
  });

  return { app, controller };
}
