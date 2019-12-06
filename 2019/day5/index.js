import fs from 'fs';
import readline from 'readline';

const scanner = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

scanner.question('Enter the ID of the component to test: ', id => {
	let input = fs.readFileSync('input');

	let instructions = getInstructions(parseInt(id));

	let memory = input
		.toString()
		.split(',')
		.map(Number);

	executeProgram(memory, instructions);

	scanner.close();
	process.exit(0);
});

function getInstructions(input) {
	return {
		1: (memory, pointer, ...args) => {
			const [arg1, isImmediateMode1, arg2, isImmediateMode2, destPos] = args;

			let value1 = isImmediateMode1 ? arg1 : memory[arg1];
			let value2 = isImmediateMode2 ? arg2 : memory[arg2];

			memory[destPos] = value1 + value2;

			return 4;
		},
		2: (memory, pointer, ...args) => {
			const [arg1, isImmediateMode1, arg2, isImmediateMode2, destPos] = args;

			let value1 = isImmediateMode1 ? arg1 : memory[arg1];
			let value2 = isImmediateMode2 ? arg2 : memory[arg2];

			memory[destPos] = value1 * value2;

			return 4;
		},
		3: (memory, pointer, ...args) => {
			const [destPos] = args;

			memory[destPos] = input;

			return 2;
		},
		4: (memory, pointer, ...args) => {
			const [outputArg, isImmediateMode] = args;

			let output = isImmediateMode ? outputArg : memory[outputArg];

			console.log('Output:', output);

			return 2;
		},
		5: (memory, pointer, ...args) => {
			const [arg1, isImmediateMode1, arg2, isImmediateMode2] = args;

			let check = isImmediateMode1 ? arg1 : memory[arg1];

			if (check !== 0) {
				let target = isImmediateMode2 ? arg2 : memory[arg2];

				return target - pointer;
			} else {
				return 3;
			}
		},
		6: (memory, pointer, ...args) => {
			const [arg1, isImmediateMode1, arg2, isImmediateMode2] = args;

			let check = isImmediateMode1 ? arg1 : memory[arg1];

			if (check === 0) {
				let target = isImmediateMode2 ? arg2 : memory[arg2];

				return target - pointer;
			} else {
				return 3;
			}
		},
		7: (memory, pointer, ...args) => {
			const [arg1, isImmediateMode1, arg2, isImmediateMode2, destPos] = args;

			let value1 = isImmediateMode1 ? arg1 : memory[arg1];
			let value2 = isImmediateMode2 ? arg2 : memory[arg2];

			if (value1 < value2) {
				memory[destPos] = 1;
			} else {
				memory[destPos] = 0;
			}

			return 4;
		},
		8: (memory, pointer, ...args) => {
			const [arg1, isImmediateMode1, arg2, isImmediateMode2, destPos] = args;

			let value1 = isImmediateMode1 ? arg1 : memory[arg1];
			let value2 = isImmediateMode2 ? arg2 : memory[arg2];

			if (value1 === value2) {
				memory[destPos] = 1;
			} else {
				memory[destPos] = 0;
			}

			return 4;
		},
	};
}

function executeProgram(memory, instructions) {
	let pointer = 0;

	while (memory[pointer] !== 99) {
		let [instruction, _, arg1Mode, arg2Mode, arg3Mode] = parseOpCode(memory[pointer]);

		let arg1 = memory[pointer + 1];
		let arg2 = memory[pointer + 2];
		let arg3 = memory[pointer + 3];

		let operation = instructions[instruction];

		let pointerIncrement = operation(
			memory,
			pointer,
			arg1,
			parseInt(arg1Mode),
			arg2,
			parseInt(arg2Mode),
			arg3,
			parseInt(arg3Mode)
		);

		pointer += pointerIncrement;
	}
}

const parseOpCode = opcode =>
	opcode
		.toString()
		.padStart(5, 0)
		.split('')
		.reverse();
