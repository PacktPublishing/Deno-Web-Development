import { MuseumController, MuseumRepository } from "./types.ts";

interface ControllerDependencies {
  museumRepository: MuseumRepository;
}

export class Controller implements MuseumController {
  museumRepository: MuseumRepository;

  constructor({ museumRepository }: ControllerDependencies) {
    this.museumRepository = museumRepository;
  }

  async getAll() {
    return this.museumRepository.getAll();
  }
}
