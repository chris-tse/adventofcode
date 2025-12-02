import fs from "fs";

const input = fs.readFileSync("input").toString();

const WIDTH = 25;
const HEIGHT = 6;

let layerSize = WIDTH * HEIGHT;

let chunked = chunk(input.split("").map(Number), layerSize);

console.log(`Part 1: ${getPart1Output()}`);
getPart2Output();

function getPart1Output() {
  let zeroCounts = chunked.map((layer) => countDigit(layer, 0));
  let fewestZeroLayer = zeroCounts.indexOf(Math.min(...zeroCounts));

  let numOnes = countDigit(chunked[fewestZeroLayer], 1);
  let numTwos = countDigit(chunked[fewestZeroLayer], 2);

  return numOnes * numTwos;
}

function getPart2Output() {
  let pixels = [];

  for (let i = 0; i < layerSize; i++) {
    pixels.push(chunked.map((layer) => layer[i]).find((p) => p !== 2));
  }

  pixels = pixels.map((p) => {
    switch (p) {
      case 0:
        return "\u2588";
      case 1:
        return "\u2591";
      case 2:
        return " ";
    }
  });

  console.log("Part 2:");

  chunk(pixels, 25).forEach((row) => {
    console.log(row.join(""));
  });
}

/**
 * Returns a nested list of sized chunks of the input array
 * @param {any[]} array Input array
 * @param {number} size Size per chunk
 * @returns {any[][]}
 */
function chunk(array, size) {
  let arrayCopy = array.slice(0);
  let result = [];

  while (arrayCopy.length > 0) {
    result.push(arrayCopy.splice(0, size));
  }

  return result;
}

/**
 * Returns the number of a given digit in array
 * @param {number[]} array Input array
 * @param {number} digit Digit to count
 * @returns {number}
 */
function countDigit(array, digit) {
  return array.reduce((acc, next) => (next === digit ? acc + 1 : acc), 0);
}

/**
 * Returns the [x,y] pair of a 2D array from the index of the matching 1D array representation
 * @param {number} index Index of 1D array`
 * @param {number} width Width of 2D array
 * @param {number} height Height of 2D array
 * @returns {number[]}
 */
function get2DCoord(index, width) {
  return [index % width, Math.floor(index / width)];
}
