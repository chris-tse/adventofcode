import { FileSystem } from "@effect/platform";
import { BunFileSystem } from "@effect/platform-bun";
import { Effect } from "effect";

export const day1 = Effect.gen(function* () {
  yield* Effect.log("Day 1");

  const fs = yield* FileSystem.FileSystem;
  const input = yield* fs.readFileString("./src/2025/input/day1.txt");
  const inputSequence = input.trim().split("\n");

  let dial = 50;

  const password = inputSequence.reduce((prev, curr) => {
    const parsed = parseRotation(curr);

    switch (parsed.op) {
      case "add": {
        const newDial = dial + parsed.value;
        dial = newDial % 100;
        return Math.floor(newDial / 100) + prev;
      }
      case "subtract": {
        const reverseDial = (100 - dial) % 100;
        const newDial = reverseDial + parsed.value;
        const zeroPasses = Math.floor(newDial / 100);
        dial = (100 - (newDial % 100)) % 100;
        return zeroPasses + prev;
      }
      default:
        console.log("impossible no op");
        return prev;
    }
  }, 0);

  yield* Effect.log({ password });
}).pipe(Effect.provide(BunFileSystem.layer));

function parseRotation(rotation: string): {
  op: "add" | "subtract";
  value: number;
} {
  const op = rotation.startsWith("R") ? "add" : "subtract";
  const value = Number.parseInt(rotation.slice(1), 10);
  return { op, value };
}
