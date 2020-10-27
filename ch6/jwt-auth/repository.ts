import { makeJwt, setExpiration, Jose, Payload } from "./deps.ts";
import { AuthRepository, Configuration } from './types.ts';

type RepositoryDependencies = { configuration: Configuration }

export class Repository implements AuthRepository {
  /**
   * Generates, gets and stores (in-memory) jwt tokens for a userId
   */
  private storage = new Map<string, string>();
  private configuration: Configuration;

  /**
   * @param dependencies object with Repository dependencies
   */
  constructor(dependencies: RepositoryDependencies) {
    this.configuration = dependencies.configuration
  }

  /**
   * Retrieves the stored token for the provided userId
   *
   * @param userId the userId to retrieve the token for
   */
  async getToken(userId: string) {
    const token = this.storage.get(userId)

    if (!token) {
      return Promise.reject('Could not get token for that userId');
    }

    return token;
  }

  /**
   * Generates and persists the token for the provided userId
   *
   * @param userId the userId to generate the token for
   */
  async generateToken(userId: string) {
    const payload: Payload = {
      iss: "museums",
      exp: setExpiration(this.configuration.tokenExpirationInSeconds),
      user: userId
    };
    const header: Jose = {
      alg: this.configuration.algorithm,
      typ: "JWT",
    };
    const token = await makeJwt({ key: this.configuration.key, header, payload })

    return token;
  };
}
