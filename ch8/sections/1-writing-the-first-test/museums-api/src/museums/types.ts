export type Museum = {
  id: string;
  name: string;
  description: string;
  location: {
    lat: string;
    lng: string;
  };
};

export interface MuseumRepository {
  getAll: () => Promise<Museum[]>;
}

export interface MuseumController {
  getAll: () => Promise<Museum[]>;
}
