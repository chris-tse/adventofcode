const fs = require("fs");

const input = fs.readFileSync("input");

let grid = input
  .toString()
  .split("\n")
  .map((line) => line.split(""));

const asteroids = grid
  .map((row) => {
    return row
      .map((node, index) => node + "_" + index)
      .filter((i) => i.startsWith("#"));
  })
  .map((row, i) => {
    return row.map((node) => node.replace("#", i));
  })
  .flat();

console.log(asteroids);

const groups = {};

asteroids.forEach((asteroid) => {
  let [x, y] = asteroid.split("_").map(Number);

  let ratio = x / y;

  if (!groups[ratio]) {
    groups[ratio] = [];
  }

  groups[ratio].push(asteroid);
});

console.log(groups);
