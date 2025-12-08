import { FileSystem } from "@effect/platform";
import { BunFileSystem, BunRuntime } from "@effect/platform-bun";
import { Effect, Array as EffectArray, Either, Schema } from "effect";

const ProductId = Schema.String.pipe(Schema.pattern(/^(\d+?)\1+$/));

function rangesToList(ranges: string[]) {
  return ranges.reduce<string[]>((result, curr) => {
    const [startStr, endStr] = curr.split("-");
    const start = Number.parseInt(startStr, 10);
    const end = Number.parseInt(endStr, 10) + 1;
    const len = end - start;
    return result.concat(
      Array.from({ length: len }, (_, i) => (start + i).toString())
    );
  }, []);
}

function isInvalidPart1(id: string) {
  if (id.length % 2 !== 0) {
    return false;
  }

  const firstHalf = id.slice(0, id.length / 2);
  const secondHalf = id.slice(id.length / 2);

  return firstHalf === secondHalf;
}

export const main = Effect.gen(function* () {
  yield* Effect.log("Day 2");

  const fs = yield* FileSystem.FileSystem;
  const input = yield* fs.readFileString("./src/2025/solutions/02/input.txt");
  const inputIdRanges = input.trim().split(",");
  const inputIds = rangesToList(inputIdRanges);

  yield* Effect.logDebug("Partitioning input IDs...");
  const [lefts, rights] = EffectArray.partitionMap(inputIds, (id) => {
    const result = Schema.decodeUnknownEither(ProductId)(id);

    return Either.isRight(result) ? Either.left(id) : Either.right(id);
  });

  yield* Effect.logDebug("Summing invalid IDs...");
  const invalidSum = lefts.reduce(
    (acc, curr) => Number.parseInt(curr, 10) + acc,
    0
  );

  yield* Effect.log({ invalidSum });
}).pipe(Effect.provide(BunFileSystem.layer));

BunRuntime.runMain(main);
