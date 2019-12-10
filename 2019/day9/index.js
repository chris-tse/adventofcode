const fs = require('fs');

let input = fs.readFileSync('input');
// let input = '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99';

let originalProgram = input
	.toString()
	.split(',')
	.map(BigInt);

let program = getNewProgram(originalProgram);

executeProgram(program, 2);

/**
 * An Intcode program
 * @typedef {Object} Program
 * @property {number[]} memory
 * @property {BigInt} pointer
 * @property {number} output
 * @property {boolean} useInput
 * @property {boolean} halted
 * @property {BigInt} relativeBase
 */

/**
 * Returns a new copy of the Intcode program
 * @param {number[]} originalProgram Original input program
 * @returns {Program}
 */
function getNewProgram(originalProgram) {
	/**
	 * @type Program
	 */
	let program = {
		memory: originalProgram.slice(0),
		pointer: 0n,
		output: null,
		useInput: false,
		halted: false,
		relativeBase: 0n,
	};

	return program;
}

function getInstructions(input) {
	const instructions = {
		input,
		/**
		 * @param {Program} program
		 */
		1: (program, ...args) => {
			const { memory } = program;
			const [value1, value2, destPos] = args;

			memory[destPos] = value1 + value2;

			return 4;
		},
		/**
		 * @param {Program} program
		 */
		2: (program, ...args) => {
			const { memory } = program;
			const [value1, value2, destPos] = args;

			memory[destPos] = value1 * value2;

			return 4;
		},
		/**
		 * @param {Program} program
		 */
		3: (program, ...args) => {
			const { memory } = program;
			const [destPos] = args;

			memory[destPos] = BigInt(instructions.input);

			return 2;
		},
		/**
		 * @param {Program} program
		 */
		4: (program, ...args) => {
			const [value] = args;

			console.log(value);
			program.output = value;

			return 2;
		},
		/**
		 * @param {Program} program
		 */
		5: (program, ...args) => {
			const { pointer } = program;
			const [check, target] = args;

			if (check !== 0n) {
				return target - pointer;
			} else {
				return 3;
			}
		},
		/**
		 * @param {Program} program
		 */
		6: (program, ...args) => {
			const { pointer } = program;
			const [check, target] = args;

			if (check === 0n) {
				return target - pointer;
			} else {
				return 3;
			}
		},
		/**
		 * @param {Program} program
		 */
		7: (program, ...args) => {
			const { memory } = program;
			const [value1, value2, destPos] = args;

			if (value1 < value2) {
				memory[destPos] = 1;
			} else {
				memory[destPos] = 0;
			}

			return 4;
		},
		/**
		 * @param {Program} program
		 */
		8: (program, ...args) => {
			const { memory } = program;
			const [value1, value2, destPos] = args;

			if (value1 === value2) {
				memory[destPos] = 1;
			} else {
				memory[destPos] = 0;
			}

			return 4;
		},
		/**
		 * @param {Program} program
		 */
		9: (program, ...args) => {
			const [arg] = args;

			program.relativeBase += BigInt(arg);

			return 2;
		},
	};

	return instructions;
}

/**
 *
 * @param {Program} program
 * @param {number} input Initial input
 */
function executeProgram(program, input) {
	let { memory } = program;
	const instructions = getInstructions(parseInt(input));

	while (memory[program.pointer] !== 99n) {
		let [instruction, _, arg1Mode, arg2Mode, arg3Mode] = parseOpCode(memory[program.pointer]);

		let arg1 = memory[program.pointer + 1n];
		let arg2 = memory[program.pointer + 2n];
		let arg3 = memory[program.pointer + 3n];

		let param1 = getParamValue(program, parseInt(instruction), arg1, parseInt(arg1Mode));
		let param2 = getParamValue(program, parseInt(instruction), arg2, parseInt(arg2Mode));
		let param3 = parseInt(arg3Mode) === 2 ? program.relativeBase + arg3 : arg3;

		let operation = instructions[instruction];

		let pointerIncrement = operation(program, param1, param2, param3);

		program.pointer += BigInt(pointerIncrement);
	}

	program.halted = true;
}

/**
 * Returns the actual value to be used based on paramter mode
 * @param {Program} program
 * @param {number} instruction
 * @param {BigInt} arg Argument retrieved from program
 * @param {number} argMode Parsed parameter mode from opcode
 * @returns {BigInt}
 */
function getParamValue(program, instruction, arg, argMode) {
	// console.log(`Param ${arg} with mode ${argMode}`);
	let { relativeBase, memory } = program;
	let value;

	if ([3].includes(instruction)) {
		if (argMode === 2) {
			return relativeBase + arg;
		} else {
			return arg;
		}
	}

	switch (argMode) {
		case 0:
			value = memory[arg];

			break;
		case 1:
			value = arg;
			break;
		case 2:
			value = memory[relativeBase + arg];
			break;
		default:
			break;
	}

	if (!value) {
		value = BigInt(0);
	}

	return value;
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
