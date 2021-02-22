import { bench, runBenchmarks } from "../deps.ts";
import { generateSalt, hashWithSalt } from "./util.ts";

bench({
  name: "runsSaltFunction1000Times",
  runs: 1000,
  func: (b) => {
    b.start();
    generateSalt();
    b.stop();
  },
});

bench({
  name: "runsHashFunction1000Times",
  runs: 1000,
  func: (b) => {
    b.start();
    hashWithSalt("password", "salt");
    b.stop();
  },
});

runBenchmarks();
