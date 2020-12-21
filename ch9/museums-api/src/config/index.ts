import { Algorithm, parse } from "../deps.ts";

type Configuration = {
  web: {
    port: number;
  };
  cors: {
    allowedOrigins: string[];
  };
  https: {
    key: string;
    certificate: string;
  };
  jwt: {
    algorithm: Algorithm;
    expirationTime: number;
    key: string;
  };
  mongoDb: {
    clusterURI: string;
    database: string;
    username: string;
    password: string;
  };
};

export async function load(
  env = "dev",
): Promise<Configuration> {
  const configuration = parse(
    await Deno.readTextFile(`./config.${env}.yaml`),
  ) as Configuration;

  return {
    ...configuration,
    web: {
      ...configuration.web,
      port: Number(Deno.env.get("PORT")) || configuration.web.port,
    },
    mongoDb: {
      ...configuration.mongoDb,
      username: Deno.env.get("MONGODB_USERNAME") || "deno-api",
      password: Deno.env.get("MONGODB_PASSWORD") || "password",
    },
    jwt: {
      ...configuration.jwt,
      key: Deno.env.get("JWT_KEY") || "insecure-key",
    },
  };
}
