import { benchmarks } from "../deps.ts";
import { generateSalt, hashWithSalt } from "./util.ts";

benchmarks.bench({
  name: "runsSaltFunction1000Times",
  runs: 1000,
  func: (b) => {
    b.start();
    generateSalt();
    b.stop();
  },
});

benchmarks.bench({
  name: "runsHashFunction1000Times",
  runs: 1000,
  func: (b) => {
    b.start();
    hashWithSalt("password", "salt");
    b.stop();
  },
});

benchmarks.runBenchmarks();
