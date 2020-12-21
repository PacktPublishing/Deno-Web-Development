import { Database, MongoClient } from "./deps.ts";
import { createServer } from "./web/index.ts";
import {
  Controller as MuseumController,
  Repository as MuseumRepository,
} from "./museums/index.ts";

import {
  Controller as UserController,
  Repository as UserRepository,
} from "./users/index.ts";
import { Algorithm, AuthRepository } from "./deps.ts";

const client = new MongoClient();
client.connectWithUri("mongodb+srv://<connection URI>");
const db = client.database("getting-started-with-deno");

const museumRepository = new MuseumRepository();
const museumController = new MuseumController({ museumRepository });

const authConfiguration = {
  algorithm: "HS512" as Algorithm,
  key: "my-insecure-key",
  tokenExpirationInSeconds: 120,
};
const authRepository = new AuthRepository({
  configuration: authConfiguration,
});

const userRepository = new UserRepository({ storage: db });
const userController = new UserController({ userRepository, authRepository });

museumRepository.storage.set("fixture-1", {
  id: "fixture-1",
  name: "Most beautiful museum in the world",
  description: "One I really like",
  location: {
    lat: "12345",
    lng: "54321",
  },
});

createServer({
  configuration: {
    port: 8080,
    authorization: {
      key: authConfiguration.key,
      algorithm: authConfiguration.algorithm,
    },
  },
  museum: museumController,
  user: userController,
});
