import { Effect } from "effect";

import { day1 } from "./solutions/day1";

const main = Effect.gen(function* () {
  yield* Effect.log("Advent of Code 2025");

  yield* Effect.log("Day 1");

  yield* day1();

  return "Success!";
});

Effect.runPromise(main).then(console.log);
