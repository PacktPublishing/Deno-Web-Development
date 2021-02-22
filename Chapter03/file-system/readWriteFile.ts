const content = await Deno.readFile("./sentence.txt");

await Deno.writeFile("./copied-sentence.txt", content);
