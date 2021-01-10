const decoder = new TextDecoder();
const content = await Deno.readFile("./sentence.txt");

console.log(decoder.decode(content));
