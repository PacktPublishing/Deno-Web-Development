import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import * as MuseumModel from './museum.ts';

Deno.test('it has initial fixtures', async () => {
  const museums = await MuseumModel.getAll();

  assertEquals(museums.length, 1)
  assertEquals(museums[0].name, 'Most beautiful museum in the world')
})
