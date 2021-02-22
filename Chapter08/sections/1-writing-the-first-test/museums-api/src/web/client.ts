import { Museum } from "../museums/index.ts";
import { LoginPayload, RegisterPayload, UserDto } from "../users/index.ts";

interface Config {
  baseURL: string;
}

export function getClient(config: Config) {
  let token: string | null = null;
  return {
    register: ({ username, password }: RegisterPayload): Promise<UserDto> => {
      return fetch(
        `${config.baseURL}/api/users/register`,
        {
          body: JSON.stringify({ username, password }),
          method: "POST",
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
        `${config.baseURL}/api/users/register`,
        {
          headers: authenticatedHeaders,
        },
      ).then((r) => r.json());
    },
  };
}
