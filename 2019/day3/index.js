import LineByLine from 'n-readlines';

const liner = new LineByLine('./input');

// Read in wire input
let wire1 = liner.next();
let wire2 = liner.next();

// Get wire paths
let wire1Paths = wire1.toString().split(',');
let wire2Paths = wire2.toString().split(',');

// Get map of wire traversal
let wire1Map = getCoordsOfWirePaths(wire1Paths);
let wire2Map = getCoordsOfWirePaths(wire2Paths);

function getCoordsOfWirePaths(paths) {
	// Build out a map of
	// {
	//	  x: Set(y)
	// }
	let coordMap = {};

	let currPoint = [0, 0];

	function addCoord(coord) {
		let [x, y] = coord;

		if (!coordMap[x]) {
			coordMap[x] = new Set();
		}

		coordMap[x].add(y);
	}

	paths.forEach(path => {
		let direction = path[0];
		let amount = parseInt(path.substr(1));

		// For each direction, increment or decrement the appropriate coord
		// Add intermediate coords to the coordMap
		switch (direction) {
			case 'R':
				for (let i = 0; i < amount; i++) {
					currPoint[0]++;
					addCoord(currPoint);
				}
				break;
			case 'L':
				for (let i = 0; i < amount; i++) {
					currPoint[0]--;
					addCoord(currPoint);
				}
				break;
			case 'U':
				for (let i = 0; i < amount; i++) {
					currPoint[1]++;
					addCoord(currPoint);
				}
				break;
			case 'D':
				for (let i = 0; i < amount; i++) {
					currPoint[1]--;
					addCoord(currPoint);
				}
				break;
			default:
				break;
		}
	});

	return coordMap;
}

/**
 * Finds list of intersection coordinates given two wire traversal maps
 * @param {Object} wire1Map
 * @param {Object} wire2Map
 */
function getIntersections(wire1Map, wire2Map) {
	let intersections = [];

	for (let w1x in wire1Map) {
		// Check if x coord in one set is in another, skip if not
		if (w1x in wire2Map) {
			let w1ySet = wire1Map[w1x];
			let w2ySet = wire2Map[w1x];

			// Check if any y-coord in first set appear in second set
			// Mark intersection if found
			w1ySet.forEach(i => {
				if (w2ySet.has(i)) {
					intersections.push([parseInt(w1x), i]);
				}
			});
		}
	}

	return intersections;
}

let distances = getIntersections(wire1Map, wire2Map)
	.map(coord => coord.map(Math.abs))
	.map(pair => pair[0] + pair[1]);

console.log(`Part 1: ${Math.min(...distances)}`);
