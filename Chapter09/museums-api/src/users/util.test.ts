import { assertEquals } from "https://deno.land/std@0.73.0/testing/asserts.ts";
import { hashWithSalt } from "./util.ts";

Deno.test("it creates the same hash from same password + salt", async () => {
  const salt = "TEST";

  assertEquals(hashWithSalt("test-pw", salt), hashWithSalt("test-pw", salt));
});
