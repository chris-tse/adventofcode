import { Effect } from "effect";

export const day1 = Effect.gen(function* () {
  yield* Effect.log("Day 1");
  return "Day 1";
});
