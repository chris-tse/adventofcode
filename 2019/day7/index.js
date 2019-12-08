import fs from 'fs';

let input = fs.readFileSync('input');

let originalMemory = input
	.toString()
	.split(',')
	.map(Number);

function getPart1Output() {
	let outputs = [];
	let inputPhases = getAllPermutations('01234');
	let amplifiers = getNewAmpList(5);

	for (let phases of inputPhases) {
		let phaseList = phases.split('');
		let input = { halted: false, value: 0 };

		for (let i = 0; i < 5; i++) {
			executeProgram(amplifiers[i], phaseList[i], input);
			input.value = amplifiers[i].output;
		}

		outputs.push(input.value);

		amplifiers = getNewAmpList(5);
	}

	return Math.max(...outputs);
}

function getPart2Output() {
	let outputs = [];
	let inputPhases = getAllPermutations('56789');
	let amplifiers = getNewAmpList(5);

	for (let phases of inputPhases) {
		let phaseList = phases.split('');
		let input = { halted: false, value: 0 };

		while (amplifiers.map(a => a.halted).includes(false)) {
			for (let i = 0; i < 5; i++) {
				executeProgram(amplifiers[i], phaseList[i], input);
				input.value = amplifiers[i].output;
			}
		}
		outputs.push(input.value);

		amplifiers = getNewAmpList(5);
	}

	return Math.max(...outputs);
}

console.log(`Part 1: ${getPart1Output()}`);
console.log(`Part 2: ${getPart2Output()}`);

/**
 * Returns a list of new amplifiers
 * @param {number} length Number of amplifiers to get
 */
function getNewAmpList(length) {
	let ampList = [];

	for (let i = 0; i < length; i++) {
		ampList.push({
			memory: [...originalMemory],
			pointer: 0,
			output: null,
			useInput: false,
			halted: false,
		});
	}

	return ampList;
}

function getInstructions(phase, input) {
	const instructions = {
		phase,
		input,
		1: (amp, ...args) => {
			const { memory } = amp;
			const [arg1, isImmediateMode1, arg2, isImmediateMode2, destPos] = args;

			let value1 = isImmediateMode1 ? arg1 : memory[arg1];
			let value2 = isImmediateMode2 ? arg2 : memory[arg2];

			memory[destPos] = value1 + value2;

			return 4;
		},
		2: (amp, ...args) => {
			const { memory } = amp;
			const [arg1, isImmediateMode1, arg2, isImmediateMode2, destPos] = args;

			let value1 = isImmediateMode1 ? arg1 : memory[arg1];
			let value2 = isImmediateMode2 ? arg2 : memory[arg2];

			memory[destPos] = value1 * value2;

			return 4;
		},
		3: (amp, ...args) => {
			const { memory } = amp;
			const [destPos] = args;

			if (amp.useInput) {
				memory[destPos] = instructions.input;
			} else {
				memory[destPos] = instructions.phase;
				amp.useInput = true;
			}

			return 2;
		},
		4: (amp, ...args) => {
			const { memory } = amp;
			const [outputArg, isImmediateMode] = args;

			amp.output = isImmediateMode ? outputArg : memory[outputArg];

			return 2;
		},
		5: (amp, ...args) => {
			const { memory, pointer } = amp;
			const [arg1, isImmediateMode1, arg2, isImmediateMode2] = args;

			let check = isImmediateMode1 ? arg1 : memory[arg1];

			if (check !== 0) {
				let target = isImmediateMode2 ? arg2 : memory[arg2];

				return target - pointer;
			} else {
				return 3;
			}
		},
		6: (amp, ...args) => {
			const { memory, pointer } = amp;
			const [arg1, isImmediateMode1, arg2, isImmediateMode2] = args;

			let check = isImmediateMode1 ? arg1 : memory[arg1];

			if (check === 0) {
				let target = isImmediateMode2 ? arg2 : memory[arg2];

				return target - pointer;
			} else {
				return 3;
			}
		},
		7: (amp, ...args) => {
			const { memory } = amp;
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
		8: (amp, ...args) => {
			const { memory } = amp;
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

	return instructions;
}

function executeProgram(amp, phase, input) {
	let { memory } = amp;
	const instructions = getInstructions(parseInt(phase), parseInt(input.value));

	while (memory[amp.pointer] !== 99) {
		let [instruction, _, arg1Mode, arg2Mode, arg3Mode] = parseOpCode(memory[amp.pointer]);

		let arg1 = memory[amp.pointer + 1];
		let arg2 = memory[amp.pointer + 2];
		let arg3 = memory[amp.pointer + 3];

		let operation = instructions[instruction];

		let pointerIncrement = operation(
			amp,
			arg1,
			parseInt(arg1Mode),
			arg2,
			parseInt(arg2Mode),
			arg3,
			parseInt(arg3Mode)
		);

		amp.pointer += pointerIncrement;

		if (instruction === '4') {
			return;
		}
	}

	amp.halted = true;
}

/**
 * Parses opcode number into instruction and modes
 * @param {number} opcode Opcode to parse into instruction and modes
 * @returns {string[]}
 */
function parseOpCode(opcode) {
	return opcode
		.toString()
		.padStart(5, 0)
		.split('')
		.reverse();
}

/**
 * Returns an array of all permutations of the given string
 * @param {string} string String to permute
 * @returns {string[]}
 */
function getAllPermutations(string) {
	const results = [];

	if (string.length === 1) {
		results.push(string);
		return results;
	}

	for (let i = 0; i < string.length; i++) {
		let firstChar = string[i];
		let charsLeft = string.substring(0, i) + string.substring(i + 1);

		let innerPermutations = getAllPermutations(charsLeft);

		for (let perm of innerPermutations) {
			results.push(firstChar + perm);
		}
	}

	return results;
}
