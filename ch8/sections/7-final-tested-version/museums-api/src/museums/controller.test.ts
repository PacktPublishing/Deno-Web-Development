import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.73.0/testing/asserts.ts";
import { Controller } from "./controller.ts";

Deno.test("it gets all the museums", async () => {
  const controller = new Controller({
    museumRepository: {
      getAll: async () => [
        {
          description: "test",
          id: "10",
          name: "museum 1",
          location: { lat: "1234", lng: "1234" },
        },
      ],
    },
  });

  const museums = await controller.getAll();
  assertEquals(museums[0].name, "museum 1", "name is correct");
  assertEquals(museums[0].id, "10", "id is correct");
  assert(museums.length === 1, "length is correct");
});
