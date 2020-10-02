import { Museum } from "./types.ts";

import { MuseumRepository } from './types.ts';

interface ControllerDependencies {
  museumRepository: MuseumRepository
}

export class Controller {
  museumRepository: MuseumRepository

  constructor({ museumRepository }: ControllerDependencies) {
    this.museumRepository = museumRepository
  }

  async getAll() {
    return this.museumRepository.getAll();
  }
}
