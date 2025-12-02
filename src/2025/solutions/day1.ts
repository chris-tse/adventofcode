import { FileSystem } from '@effect/platform';
import { BunFileSystem } from '@effect/platform-bun';
import { Effect } from 'effect';

export const day1 = Effect.gen(function* () {
    yield* Effect.log('Day 1');

    const fs = yield* FileSystem.FileSystem;
    const input = yield* fs.readFileString('./src/2025/input/day1.txt');
    const inputSequence = input.trim().split('\n');

    let dial = 50;

    const password = inputSequence.reduce((prev, curr) => {
        const parsed = parseRotation(curr);

        if (parsed.op === 'add') {
            dial = wrapNumber(dial + parsed.value);
        } else {
            dial = wrapNumber(dial - parsed.value);
        }

        // console.log('Rotation', curr, ' point at', dial === 0 ? '**0**' : dial);

        if (dial === 0) {
            return prev + 1;
        }

        return prev;
    }, 0);

    yield* Effect.log({ password });
}).pipe(Effect.provide(BunFileSystem.layer));

function parseRotation(rotation: string): {
    op: 'add' | 'subtract';
    value: number;
} {
    const op = rotation.startsWith('R') ? 'add' : 'subtract';
    const value = Number.parseInt(rotation.slice(1), 10);
    return { op, value };
}

function wrapNumber(newNumber: number) {
    return ((newNumber % 100) + 100) % 100;
}
