const file = await Deno.open("./file-to-read.txt", { read: true });
const decoder = new TextDecoder();

const destinationArray = new Uint8Array(16);

await file.read(destinationArray);

console.log(decoder.decode(destinationArray));
