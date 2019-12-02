import LineByLine from 'n-readlines';

const liner = new LineByLine('./input');
let line = liner.next();
let fuelSum = 0;

while (line) {
	let input = parseInt(line.toString());
	let currFuel = getFuelByMass(input);

	fuelSum += currFuel;

	line = liner.next();
}

console.log('Total fuel required:', fuelSum);

/**
 * Returns the amount of fuel needed for any given mass
 * @param {number} mass
 */
function getFuelByMass(mass) {
	return Math.floor(mass / 3) - 2;
}
