import { RegisterPayload } from "../users/types.ts";

interface Config {
  baseURL: string;
}
export function getClient(config: Config) {
  return {
    register: ({ username, password }: RegisterPayload) => {
    },
  };
}
