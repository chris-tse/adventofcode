"use strict";

var _nReadlines = _interopRequireDefault(require("n-readlines"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var liner = new _nReadlines["default"]('./input');
var fuelSum = 0;
var line = liner.next();

while (line) {
  var input = parseInt(line.toString());
  var currFuel = recursiveGetFuelByMass(0, input);
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
 * Returns the amount of fuel needed for any given mass taking into account fuel required for the fuel
 * @param {number} mass
 */


function recursiveGetFuelByMass(sum, nextMass) {
  var fuel = getFuelByMass(nextMass);

  if (fuel > 0) {
    return recursiveGetFuelByMass(sum + fuel, fuel);
  } else {
    return sum;
  }
}

