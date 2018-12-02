const fs = require('fs')

let data = fs.readFileSync('input', 'utf-8').split('\n');

for (let id1 of data) {
    for (let id2 of data) {
        if (id1 === id2) 
            continue;
            
        if (distance(id1, id2) === 1) {
            console.log('Match:', id1, id2);
            return;
        }
    }
}

function distance(str1, str2) {
    if (str1.length !== str2.length) {
        return -1;
    }
    
    let len = str1.length;
    let distance = 0;
    
    for (let i = 0; i < len; i++) {
        if (str1[i] !== str2[i])
            distance++;
    }
    return distance;
}