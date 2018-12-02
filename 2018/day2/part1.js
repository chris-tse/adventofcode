const fs = require('fs')

let data = fs.readFileSync('input', 'utf-8').split('\n');

let exactlyTwo = 0;
let exactlyThree = 0;

for (let id of data) {
    let currCount = countChars(id);
    let entries = Object.values(currCount);
    
    if (entries.includes(2)) {
        exactlyTwo++;
    }
    
    if (entries.includes(3)) {
        exactlyThree++;
    }
}

console.log(exactlyTwo, exactlyThree, exactlyTwo * exactlyThree);


function countChars(id) {
    let count = {};
    
    [...id].forEach(char => {
        if (!count[char])
            count[char] = 1;
        else
            count[char]++;
    });
    
    return count;
}