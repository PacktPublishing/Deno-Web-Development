import { serve, ServerRequest } from "https://deno.land/std/http/server.ts"
import { v4 } from "https://deno.land/std/uuid/mod.ts";

let postIts: Record<string, PostIt> = {}
/**
 * Describes the PostIt entity stored in the in-memory database
 */
interface PostIt {
  title: string,
  id: string,
  body: string,
  createdAt: Date
}

/**
 * Seeds the database with some initial records
 */
function seed() {
  const dataToSeed = [
    { title: 'Deno', body: 'Read PacktPub book', createdAt: new Date(), id: '' },
    { title: 'Learning', body: 'Write an application with Deno', createdAt: new Date(), id: 'asdsa' }
  ]

  dataToSeed.forEach(data => {
    const id = v4.generate();
    postIts[id] = { ...data, id }
  })
}
seed();

const headers = new Headers()
headers.set('Content-Type', 'application/json');
// Enable cors
headers.set('Access-Control-Allow-Origin', '*');
headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');

const s = serve(':8080');
console.log('Server listening on port http://localhost:8080');
for await (let req of s) {
  // Log requests on arrival
  console.log(`${new Date()} ${req.method} ${req.url}`);
  handleRoute(req)
}

/**
 * Function that routes and handles requests
 * @param req Request coming from the client
 */
async function handleRoute(req: ServerRequest) {
  // Very rough routing
  const url = new URL(`http://localhost${req.url}`);
  const methodUrl = `${req.method} ${url.pathname}`

  switch (methodUrl) {
    case 'GET /api/post-its': {
      const postItsList = Object.keys(postIts).reduce((allPostIts: PostIt[], postItId) => {
        return allPostIts.concat(postIts[postItId]);
      }, []);

      return req.respond({ body: JSON.stringify({ postIts: postItsList }), headers });
    }
    case 'POST /api/post-its': {
      const params = new TextDecoder().decode(await Deno.readAll(req.body));
      if (!params) {
        req.respond({ status: 400 });
        return;
      }

      const urlParams = JSON.parse(params);

      const id = v4.generate();
      postIts[id] = {
        id,
        title: urlParams.title,
        body: urlParams.body,
        createdAt: new Date()
      }

      return req.respond({ status: 201, body: JSON.stringify(postIts[id]), headers })
    }
    case 'OPTIONS /api/post-its/add':
      return req.respond({ status: 200, headers });

    default:
      return req.respond({ status: 404, body: JSON.stringify({ message: 'Route not found' }) });
  }
}
