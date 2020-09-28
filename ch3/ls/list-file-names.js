const [path = "."] = Deno.args;
for await (const dir of Deno.readDir(path)) {
  console.log(dir.name);
}
