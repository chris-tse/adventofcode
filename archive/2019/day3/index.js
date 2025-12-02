import LineByLine from "n-readlines";

const liner = new LineByLine("./input");

// Read in wire input
let wire1 = liner.next();
let wire2 = liner.next();

// Get wire paths
let wire1Paths = wire1.toString().split(",");
let wire2Paths = wire2.toString().split(",");

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
  let length = 0;

  function addCoord(coord, length) {
    if (!coordMap[coord]) {
      coordMap[coord] = length;
    }
  }

  paths.forEach((path) => {
    let direction = path[0];
    let amount = parseInt(path.substr(1));

    const dX = { R: 1, L: -1, U: 0, D: 0 };
    const dY = { R: 0, L: 0, U: 1, D: -1 };

    for (let i = 0; i < amount; i++) {
      currPoint[0] += dX[direction];
      currPoint[1] += dY[direction];
      length++;

      addCoord(currPoint, length);
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

  for (let w1coord in wire1Map) {
    // Check if x coord in one set is in another, skip if not
    if (w1coord in wire2Map) {
      intersections.push({
        coord: w1coord,
        length: wire1Map[w1coord] + wire2Map[w1coord],
      });
    }
  }

  return intersections;
}

let intersections = getIntersections(wire1Map, wire2Map);

let part1 = intersections
  .map((i) => i.coord)
  .map((i) => i.split(","))
  .map((coord) => Math.abs(coord[0]) + Math.abs(coord[1]));

let part2 = intersections.map((i) => i.length);

console.log(`Part 1: ${Math.min(...part1)}`);
console.log(`Part 2: ${Math.min(...part2)}`);
