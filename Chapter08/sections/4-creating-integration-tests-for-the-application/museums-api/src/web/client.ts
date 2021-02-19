import type { Museum } from "../museums/index.ts";
import type { LoginPayload, RegisterPayload, UserDto } from "../users/types.ts";

interface Config {
  baseURL: string;
}

const headers = new Headers();
headers.set("content-type", "application/json");

export function getClient(config: Config) {
  let token: string | null = null;
  return {
    register: ({ username, password }: RegisterPayload): Promise<UserDto> => {
      return fetch(
        `${config.baseURL}/api/users/register`,
        {
          body: JSON.stringify({ username, password }),
          method: "POST",
          headers,
        },
      ).then((r) => r.json());
    },
    login: (
      { username, password }: LoginPayload,
    ): Promise<{ user: UserDto; token: string }> => {
      return fetch(
        `${config.baseURL}/api/login`,
        {
          body: JSON.stringify({ username, password }),
          method: "POST",
          headers,
        },
      ).then((response) => {
        if (response.status < 300) {
          return response.json();
        }

        throw response.json();
      })
        .then((response) => {
          token = response.token;

          return response;
        });
    },
    getMuseums: (): Promise<{ museums: Museum[] }> => {
      const authenticatedHeaders = new Headers();
      authenticatedHeaders.set("authorization", `Bearer ${token}`);
      return fetch(
        `${config.baseURL}/api/museums`,
        {
          headers: authenticatedHeaders,
        },
      ).then((r) => r.json());
    },
  };
}
