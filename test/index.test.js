// npm run test

const stampTime = new Date()
//----------------------- Setup --------
//--------------------------------------
let testDataA = require('./data.test.js');
const colorConvertorC = require('./../simple_color_converter.js');
const color = require('./../simple_color_converter.js');
const tester = function (input, output, description) {
    const instanceOfConvert = new colorConvertorC(input)
    const temp = JSON.stringify(instanceOfConvert.color) === JSON.stringify(output)

    if (temp) {
        console.log(temp, instanceOfConvert.color)
    } else {
        console.log('\x1b[36m', temp, 'line:' ,settings.total + 2, '\x1b[0m', instanceOfConvert.color, description);
    }

    if (temp === true) {
        settings.pass++
    } else {
        settings.fail++
    }
    settings.total++

    return temp
}

const settings = {
    pass: 0,
    fail: 0,
    total: 0,
    procent: 0,
}

//----------------------- Data- --------
//--------------------------------------
// Return only the last element not to run all elements
if (process.argv.length === 3 && process.argv.indexOf('last') > -1 && process.argv.indexOf('all') === -1) {
    testDataA = [testDataA.pop()];
}

//----------------------- Run ----------
//--------------------------------------

for (let t in testDataA) {
    tester(testDataA[t][0], testDataA[t][1], testDataA[t][2])
}

settings.procent = (settings.pass / settings.total * 100).toFixed(2);

console.log('-------------------------------------');
console.log(`Pass: ${settings.pass} | Fail: ${settings.fail} || ${settings.procent}% T:`, new Date() - stampTime)
console.log('-------------------------------------');