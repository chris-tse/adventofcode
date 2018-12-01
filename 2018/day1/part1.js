const fs = require('fs')

let data = fs.readFileSync('input', 'utf-8').split('\n');

let sum = 0;

data.forEach(num => {
    sum += parseInt(num);
})

console.log(sum);