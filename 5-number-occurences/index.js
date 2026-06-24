const rl = require('readline-sync');

function parseInt(str){
    const strs = str.split(' ');
    const integers = [];

    for (let i = 0; i < strs.length; i++){
        let integer = +strs[i];
        integers.push(integer);
    }
    return integers;
}

function buildOccurences(values){
    const occurences = {};
    
    for (let i = 0; i < values.length; i++){
        let value = values[i];

        if (value in occurences){
            occurences[value]++;
        } else{
            occurences[value] = 1;
        }
    }
    return occurences;
}

let strs = [];

while(true){
    strs = parseInt(rl.question('Enter the integers between 1 and 100: '));
    let isValid = true;

    for (let i = 0; i < strs.length; i++){
        if (strs[i] < 1 || strs[i] > 100 || isNaN(strs[i])){
            isValid = false;
            break;
        }
    }
    
    if (isValid){
        break;
    }
}

const occurences = buildOccurences(strs);

for ( const value in occurences){
    let occurence = occurences[value];
    
    if (occurence === 1){
        console.log(`${value} occurs ${occurence} time.`)
    } else{
        console.log(`${value} occurs ${occurence} times.`)
    }
}