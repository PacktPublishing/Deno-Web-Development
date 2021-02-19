import { MongoClient } from "./deps.ts";
import { createServer } from "./web/index.ts";
import {
  Controller as MuseumController,
  Repository as MuseumRepository,
} from "./museums/index.ts";

import {
  Controller as UserController,
  Repository as UserRepository,
} from "./users/index.ts";
import { AuthRepository } from "./deps.ts";
import { load as loadConfiguration } from "./config/index.ts";

const config = await loadConfiguration();

const client = new MongoClient();
client.connectWithUri(
  `mongodb+srv://${config.mongoDb.username}:${config.mongoDb.password}@${config.mongoDb.clusterURI}`,
);
const db = client.database(config.mongoDb.database);

const museumRepository = new MuseumRepository();
const museumController = new MuseumController({ museumRepository });

const authConfiguration = {
  algorithm: config.jwt.algorithm,
  key: config.jwt.key,
  tokenExpirationInSeconds: config.jwt.expirationTime,
};
const authRepository = new AuthRepository({
  configuration: authConfiguration,
});

const userRepository = new UserRepository({ storage: db });
const userController = new UserController({ userRepository, authRepository });

museumRepository.storage.set("1fbdd2a9-1b97-46e0-b450-62819e5772ff", {
  id: "1fbdd2a9-1b97-46e0-b450-62819e5772ff",
  name: "The Louvre",
  description:
    "The world’s largest art museum and a historic monument in Paris, France.",
  location: {
    lat: "48.860294",
    lng: "2.33862",
  },
});

createServer({
  configuration: {
    port: config.web.port,
    authorization: {
      key: authConfiguration.key,
      algorithm: authConfiguration.algorithm,
    },
    allowedOrigins: config.cors.allowedOrigins,
    secure: false,
    certFile: config.https.certificate,
    keyFile: config.https.key,
  },
  museum: museumController,
  user: userController,
});
