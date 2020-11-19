const file = await Deno.open("./file-to-read.txt", { read: true });

const contents = await Deno.readAll(file);
const decoder = new TextDecoder();

console.log(decoder.decode(contents));
