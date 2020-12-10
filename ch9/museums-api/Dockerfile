FROM hayd/alpine-deno:1.3.0

EXPOSE 8080
# The port that your application listens to.

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY lock.json .
COPY src/deps.ts ./src/deps.ts

RUN deno cache --lock=lock.json --unstable ./src/deps.ts

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache --unstable src/index.ts

CMD ["run", "--allow-net", "--allow-env", "--unstable", "--allow-read", "./src/index.ts"]
