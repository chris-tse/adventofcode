const fs = require("fs");

let data = fs.readFileSync("input", "utf-8").split("\n");

let sum = 0;
let history = new Set();
let index = 0;

while (!history.has(sum)) {
  history.add(sum);
  sum += parseInt(data[index]);
  index++;
  if (index >= data.length) {
    index = 0;
  }
}

console.log(sum);
