import { userToUserDto } from "./adapter.ts";
import { RegisterPayload, UserController, UserRepository } from "./types.ts";

interface ControllerDependencies {
  userRepository: UserRepository;
}

export class Controller implements UserController {
  userRepository: UserRepository;

  constructor({ userRepository }: ControllerDependencies) {
    this.userRepository = userRepository;
  }

  public async register(payload: RegisterPayload) {
    if (await this.userRepository.exists(payload.username)) {
      return Promise.reject("Username already exists");
    }

    const createdUser = await this.userRepository.create(
      payload.username,
      payload.password,
    );

    return userToUserDto(createdUser);
  }
}
