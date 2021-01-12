import { userToUserDto } from "./adapter.ts";
import type {
  RegisterPayload,
  UserController,
  UserRepository,
} from "./index.ts";
import { generateSalt, hashWithSalt } from "./util.ts";

interface ControllerDependencies {
  userRepository: UserRepository;
}

export class Controller implements UserController {
  userRepository: UserRepository;

  constructor({ userRepository }: ControllerDependencies) {
    this.userRepository = userRepository;
  }

  private async getHashedUser(username: string, password: string) {
    const salt = generateSalt();
    const user = {
      username,
      hash: hashWithSalt(password, salt),
      salt,
    };

    return user;
  }

  public async register(payload: RegisterPayload) {
    if (await this.userRepository.exists(payload.username)) {
      return Promise.reject("Username already exists");
    }

    const createdUser = await this.userRepository.create(
      await this.getHashedUser(payload.username, payload.password),
    );

    return userToUserDto(createdUser);
  }
}
