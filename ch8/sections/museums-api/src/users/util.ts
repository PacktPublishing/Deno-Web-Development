import { encodeToString } from "https://deno.land/std@0.71.0/encoding/hex.ts";
import { createHash } from "https://deno.land/std@0.67.0/hash/mod.ts";

export const hashWithSalt = (password: string, salt: string) => {
  const hash = createHash("sha512")
    .update(`${password}${salt}`)
    .toString();

  return hash;
};

export const generateSalt = () => {
  const arr = new Uint8Array(64);
  crypto.getRandomValues(arr);

  return encodeToString(arr);
};
