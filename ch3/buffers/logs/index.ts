import start from './logCreator.ts';

const buffer = new Deno.Buffer();
const decoder = new TextDecoder();

start(buffer);
processLogs();


async function processLogs() {
  const destination = new Uint8Array(100);
  const readBytes = await buffer.read(destination);
  if (readBytes) {
    const read = decoder.decode(destination);

    if (read.includes('Tue')) {
      console.log(read);
    }
  }

  setTimeout(processLogs, 100)
}
