import fs from 'fs';

/**
 * A system represented as a list of PARENT)CHILD orbit pairs
 * @typedef {string[]} OrbitList
 */
let input = fs
	.readFileSync('input')
	.toString()
	.split('\n');

/**
 * Returns the total number of orbits and indirect orbits in the system
 * @param {OrbitList} input
 */
function getOrbitCount(input) {
	let frontier = ['COM'];
	let orbitCounter = {
		COM: 0,
	};

	while (frontier.length > 0) {
		let currentOrbit = frontier.pop();

		input
			.filter(orbit => orbit.startsWith(currentOrbit))
			.map(orbit => orbit.split(')')[1])
			.forEach(obj => {
				orbitCounter[obj] = orbitCounter[currentOrbit] + 1;

				frontier.push(obj);
			});
	}

	return Object.values(orbitCounter).reduce((acc, next) => acc + next, 0);
}

/**
 * Returns the object path to transfer orbits to get source object into same orbit as destination object
 * @param {OrbitList} input
 * @param {string} src Source object to begin search from
 * @param {string} dest Destination object to reach orbit with
 */
function getConnectingOrbitCount(input, src, dest) {
	/**
	 * A map of orbitters to their parent
	 * @typedef OrbitterMap
	 */
	let orbits = input.reduce((acc, next) => {
		let [parent, child] = next.split(')');

		acc[child] = parent;

		return acc;
	}, {});

	/**
	 * Returns a path from start object to COM
	 * @param {string} start Start object
	 * @param {Object.<string, string>} orbits Map of orbitters to parents
	 */
	function getPathToCOM(start, orbits) {
		let resPath = [];

		let nextObj = orbits[start];

		while (nextObj !== 'COM') {
			resPath.push(nextObj);
			nextObj = orbits[nextObj];
		}

		return resPath;
	}

	const srcPath = getPathToCOM('YOU', orbits);
	const destPath = getPathToCOM('SAN', orbits);

	let connectingObj = '';

	for (let obj of srcPath) {
		if (destPath.indexOf(obj) >= 0) {
			connectingObj = obj;
			break;
		}
	}

	return srcPath.indexOf(connectingObj) + destPath.indexOf(connectingObj);
}

console.log(`Part 1: ${getOrbitCount(input)}`);
console.log(`Part 2: ${getConnectingOrbitCount(input, 'YOU', 'SAN')}`);
