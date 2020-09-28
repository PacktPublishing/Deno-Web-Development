import { Museum } from "../controllers/museum.ts";

const Database = new Map<string, Museum>();

Database.set('fixture-1', {
  id: 'fixture-1',
  name: 'Most beautiful museum in the world',
  description: 'One I really like',
  location: {
    lat: '12345',
    lng: '54321'
  }
});

export const get = async (id: string) => {
  return Database.get(id);
}

export const getAll = async () => {
  return [...Database.values()];
}
