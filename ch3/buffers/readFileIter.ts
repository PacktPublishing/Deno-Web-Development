const decoder = new TextDecoder();

const file = await Deno.open("./file-to-read.txt", { read: true });

for await (let partial of Deno.iter(file)) {
  console.log(decoder.decode(partial));
}
