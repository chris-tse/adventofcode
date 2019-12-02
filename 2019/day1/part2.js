import LineByLine from 'n-readlines';

const liner = new LineByLine('./input');

let fuelSum = 0;

let line = liner.next();

while (line) {
	let input = parseInt(line.toString());
	let currFuel = recursiveGetFuelByMass(input);

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

/**
 * Returns the amount of fuel needed for any given mass taking into account extra fuel required for the fuel
 * @param {number} mass Mass remaining to find fuel for
 * @param {number} sum Accumulator for currently computed sum of additional fuel
 */
function recursiveGetFuelByMass(mass, sum = 0) {
	let fuel = getFuelByMass(mass);

	if (fuel > 0) {
		return recursiveGetFuelByMass(fuel, sum + fuel);
	} else {
		return sum;
	}
}
