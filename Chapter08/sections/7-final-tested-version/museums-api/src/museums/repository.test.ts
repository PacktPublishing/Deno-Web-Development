import { assertEquals } from "https://deno.land/std@0.73.0/testing/asserts.ts";
import { Repository } from "./repository.ts";

Deno.test("it should start with an empty data source", async () => {
  const repository = new Repository();

  const museums = await repository.getAll();

  assertEquals(museums.length, 0);
});

Deno.test("it should return all the museums", async () => {
  const repository = new Repository();

  repository.loadFixtures([
    {
      description: "very cool museum",
      name: "museum-1",
      id: "20",
      location: {
        lat: "1234",
        lng: "1234",
      },
    },
    {
      description: "great museum",
      name: "museum-2",
      id: "30",
      location: {
        lat: "4321",
        lng: "4321",
      },
    },
  ]);

  const museums = await repository.getAll();

  assertEquals(museums.length, 2);

  assertEquals(museums[0].name, "museum-1");
  assertEquals(museums[0].location.lat, "1234");

  assertEquals(museums[1].name, "museum-2");
  assertEquals(museums[1].location.lat, "4321");
});

Deno.test("it should return a museum by id", async () => {
  const repository = new Repository();

  repository.loadFixtures([{
    description: "very cool museum",
    name: "museum-1",
    id: "20",
    location: {
      lat: "1234",
      lng: "1234",
    },
  }]);

  const museum = await repository.get("20");

  assertEquals(museum?.name, "museum-1");
  assertEquals(museum?.location.lat, "1234");
});
