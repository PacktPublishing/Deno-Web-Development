import { join } from 'https://deno.land/std@0.89.0/path/mod.ts';

const [path = "."] = Deno.args;

for await (const dir of Deno.readDir(path)) {
  let fileInfo = await Deno.stat(join(path,dir.name));

  const modificationTime = fileInfo.mtime;
  const message = [
    fileInfo.size.toString().padEnd(4),

    `${modificationTime?.getUTCMonth().toString().padStart(2)}/${
      modificationTime?.getUTCDay().toString().padEnd(2)
    }`,
    dir.name,
  ];

  console.log(message.join(""));
}
