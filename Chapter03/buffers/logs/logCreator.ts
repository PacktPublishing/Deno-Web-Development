const encoder = new TextEncoder();

const fileContents = await Deno.readFile("./example-log.txt");

const decoder = new TextDecoder();
const logLines = decoder.decode(fileContents).split("\n");

export default function start(buffer: Deno.Buffer) {
  setInterval(() => {
    const randomLine = Math.floor(
      Math.min(Math.random() * logLines.length, logLines.length),
    );
    buffer.write(encoder.encode(logLines[randomLine]));
  }, 100);
}
