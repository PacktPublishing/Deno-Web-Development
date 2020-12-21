import { t } from "../deps.ts";
import { Controller } from "./controller.ts";

Deno.test("it lists all the museums", async () => {
  const controller = new Controller({
    museumRepository: {
      getAll: async () => [{
        description: "amazing museum",
        id: "1",
        location: {
          lat: "123",
          lng: "321",
        },
        name: "museum",
      }],
    },
  });

  const [museum] = await controller.getAll();

  t.assertEquals(museum.name, "museum");
  t.assertEquals(museum.description, "amazing museum");
  t.assertEquals(museum.id, "1");
  t.assertEquals(museum.location.lat, "123");
  t.assertEquals(museum.location.lng, "321");
});
