import { red } from "https://deno.land/std@0.83.0/fmt/colors.ts";

const [path = "."] = Deno.args;

await Deno.permissions.request({
  name: "read",
  path: path,
});

for await (const dir of Deno.readDir(path)) {
  if (dir.isDirectory) {
    console.log(red(dir.name));
  } else {
    console.log(dir.name);
  }
}
