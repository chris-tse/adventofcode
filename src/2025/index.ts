import { BunRuntime } from "@effect/platform-bun";
import { Effect } from "effect";
import { day1 } from "./solutions/day1.ts";

const main = Effect.gen(function* () {
  yield* Effect.log("Advent of Code 2025");

  yield* day1;
});

BunRuntime.runMain(main);
