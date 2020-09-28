import { createServer } from './web/createServer.ts';
import * as MuseumController from './controllers/museum.ts';
import * as MuseumRepository from './repositories/museum.ts';

createServer({
  configuration: { port: 8080 },
  museum: {
    getAll: () => {
      return MuseumController.getAll({
        museumRepository: MuseumRepository
      })
    }
  }
})
