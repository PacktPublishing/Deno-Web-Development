import { Museum } from "../museums/index.ts";
import { LoginPayload, RegisterPayload, UserDto } from "../users/types.ts";

let client = {
  baseURL: "",
  loginToken: null,
};

export function getClient({ baseURL }: { baseURL: string }) {
  client.baseURL = baseURL;
  return {
    login,
    register,
    getMuseums,
  };
}

async function login(
  { username, password }: LoginPayload,
): Promise<{ token: string; user: UserDto }> {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  return fetch(`${client.baseURL}/api/login`, {
    body: JSON.stringify({ username, password }),
    method: "POST",
    headers,
  })
    .then(async (r) => {
      return r.json()
        .then((response) => {
          client.loginToken = response.token;

          return response;
        });
    })
    .catch((e) => {
      console.error(e);

      throw e;
    });
}

async function register(
  { username, password }: RegisterPayload,
): Promise<UserDto> {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  return fetch(`${client.baseURL}/api/users/register`, {
    body: JSON.stringify({ username, password }),
    method: "POST",
    headers,
  })
    .then((r) => r.json())
    .catch((e) => {
      console.error(e);

      throw e;
    });
}

async function getMuseums(): Promise<Museum[]> {
  if (!client.loginToken) {
    throw new Error("You need to be logged in to get museums");
  }

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${client.loginToken}`);
  return fetch(`${client.baseURL}/api/museums`, {
    headers,
  })
    .then((r) => r.json())
    .catch((e) => {
      console.error(e);

      throw e;
    });
}
