export type Museum = {
  id: string,
  name: string,
  description: string,
  location: {
    lat: string,
    lng: string
  }
}

interface GetAllDependencies {
  museumRepository: {
    getAll: () => Promise<Museum[]>
  }
}

export async function getAll({ museumRepository }: GetAllDependencies) {
  return museumRepository.getAll();
}
