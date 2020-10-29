import { MongoClient, Database } from '../deps.ts';

interface CreateDatabaseClientDependencies {
  username: string,
  password: string,
  host: string
}

let Client: Database;

export function connect({
  username,
  password,
  host,
}: CreateDatabaseClientDependencies) {
  // OOUulHJRnUYjDOwW
  const client = new MongoClient();
  client.connectWithUri(`mongodb+srv://${username}:${password}@${host}/?retryWrites=true&w=majority`);

  Client = client.database("getting-started-with-deno");

  return get();
}

export function get() {
  return Client;
}
