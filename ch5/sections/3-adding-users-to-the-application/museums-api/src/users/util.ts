import { encodeToString } from "https://deno.land/std@0.83.0/encoding/hex.ts";
import { createHash } from "https://deno.land/std@0.83.0/hash/mod.ts";

export const hashWithSalt = (text: string, salt: string) => {
  const hash = createHash("sha512")
    .update(`${text}${salt}`)
    .toString();

  return hash;
};

export const generateSalt = () => {
  const arr = new Uint8Array(64);
  crypto.getRandomValues(arr);

  return encodeToString(arr);
};
