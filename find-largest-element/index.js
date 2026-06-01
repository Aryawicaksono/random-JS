const rl = require('readline-sync');

function parseNumbers(str){
    const strs = str.split(' ');
    const numbers = [];

    for (let i = 0; i < strs.length; i++){
        const number = +strs[i];
        numbers.push(number);
    }
    return numbers;
}

function findLargestNumber(table){
    let largestNumber = Number.NEGATIVE_INFINITY;
    let largestNumberCoordinate;

    for (let row = 0; row < table.length; row++){
        for ( let col = 0; col < table[row].length; col++){
            let number = table[row][col];

            if (number > largestNumber){
                largestNumber = number;
                largestNumberCoordinate = {row, col};
            }
        }
    }

    return largestNumberCoordinate;
}

const numbers = parseNumbers(rl.question('Enter the number of rows and columns in the array: '));
const rows = numbers[0];
const columns = numbers[1];

let table = [];

console.log('Enter the array:')

for (let row = 0; row < rows; row++){
    
    let numbers;

    while (true){
        numbers = parseNumbers(rl.question());
        if (numbers.length !== columns){
            console.log(`your input desn\'t match of ${columns} column.`);
        } else {
            break;
        }
    }
    table.push(numbers);
}

const coordinate = findLargestNumber(table);

console.log(`The location of the largest element is ${table[coordinate.row][coordinate.col]} at (${coordinate.row}, ${coordinate.col})`)