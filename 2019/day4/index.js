const RANGE = [197487, 673251];

let numbers = [];

for (let i = RANGE[0]; i <= RANGE[1]; i++) {
	numbers.push(i);
}

let noDecreasingPasswords = numbers.filter(noDecreasingDigits);

let validPasswords = noDecreasingPasswords.filter(hasMatchingAdjacent);
let validPasswords2 = noDecreasingPasswords.filter(hasMatchingAdjacentUpdated);

console.log(`Part 1: ${validPasswords.length}`);
console.log(`Part 2: ${validPasswords2.length}`);

function hasMatchingAdjacent(num) {
	let number = num.toString();
	let digits = number.split('');

	for (let i = 0; i < digits.length - 1; i++) {
		if (number.includes(digits[i].repeat(2))) {
			return true;
		}
	}

	return false;
}

function hasMatchingAdjacentUpdated(num) {
	let number = num.toString();
	let digits = number.split('');

	for (let i = 0; i < digits.length - 1; i++) {
		if (number.includes(digits[i].repeat(2)) && !number.includes(digits[i].repeat(3))) {
			return true;
		}
	}

	return false;
}

function noDecreasingDigits(num) {
	let digits = num.toString().split('');

	for (let i = 0; i < digits.length - 1; i++) {
		if (digits[i] > digits[i + 1]) {
			return false;
		}
	}

	return true;
}
