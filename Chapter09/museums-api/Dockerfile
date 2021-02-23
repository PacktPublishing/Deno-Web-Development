FROM hayd/alpine-deno:1.6.0

WORKDIR /app

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY lock.json .
COPY src/deps.ts ./src/deps.ts

RUN deno cache --lock=lock.json --unstable ./src/deps.ts

# These steps will be re-run upon each file change in your working directory:
COPY . .

CMD ["deno", "run", "--allow-net", "--unstable", "--allow-env", "--allow-read", "--allow-write", "--allow-plugin", "src/index.ts" ]
