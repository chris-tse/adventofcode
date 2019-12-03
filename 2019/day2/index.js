import fs from 'fs';

let input = fs.readFileSync('input');

const instructions = {
	1: (arg1Pos, arg2Pos, destPos, memory) => {
		memory[destPos] = memory[arg1Pos] + memory[arg2Pos];
	},
	2: (arg1Pos, arg2Pos, destPos, memory) => {
		memory[destPos] = memory[arg1Pos] * memory[arg2Pos];
	},
};

let originalMemory = input
	.toString()
	.split(',')
	.map(Number);

let memory = [...originalMemory];

executeProgram(12, 2, memory);

let part1Res = memory[0];

console.log('Part 1');
console.log(`Output: ${part1Res}`);

for (let noun = 0; noun <= 99; noun++) {
	for (let verb = 0; verb <= 99; verb++) {
		let memory = [...originalMemory];

		executeProgram(noun, verb, memory);

		if (memory[0] === 19690720) {
			console.log('Part 2');
			console.log(`Noun: ${noun}, Verb: ${verb}`);
			console.log(`100 * ${noun} + ${verb}: ${100 * noun + verb}`);
			process.exit(0);
		}
	}
}

function executeProgram(noun, verb, memory) {
	memory[1] = noun;
	memory[2] = verb;

	let currPos = 0;

	while (memory[currPos] !== 99) {
		let opcode = memory[currPos];
		let arg1Pos = memory[currPos + 1];
		let arg2Pos = memory[currPos + 2];
		let destPos = memory[currPos + 3];

		let instruction = instructions[opcode];

		instruction(arg1Pos, arg2Pos, destPos, memory);

		currPos += 4;
	}
}
