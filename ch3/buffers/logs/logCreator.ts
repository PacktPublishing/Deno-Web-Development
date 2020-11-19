const encoder = new TextEncoder();

const fileContents = await Deno.readFile("./logs/example-log.txt");

const decoder = new TextDecoder();
const logLines = decoder.decode(fileContents).split("\n");

export default function start(buffer: Deno.Buffer) {
  setInterval(() => {
    const randomLine = Math.round(
      Math.min(Math.random() * 1000, logLines.length),
    );
    buffer.write(encoder.encode(logLines[randomLine]));
  }, 100);
}
