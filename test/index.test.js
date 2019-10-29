let stampTime = new Date()
//----------------------- Setup --------
//--------------------------------------
let testData = require('./data.test.js');
const colorConvertor = require('./../simple_color_converter.js');
const tester = function (input, output) {
    const color = colorConvertor(input)
    const temp = JSON.stringify(color) === JSON.stringify(output)
    console.log(temp, color)

    if (temp === true) {
        settings.pass ++
    } else {
        settings.fail ++
    }
    settings.total ++

    return temp
} 

var settings = {
    pass: 0,
    fail: 0,
    total: 0, 
    procent: 0,
}

//----------------------- Data- --------
//--------------------------------------
// Return only the last element not to run all elements
if(process.argv.length === 3 && process.argv.indexOf('last') > -1 && process.argv.indexOf('all') === -1){
    testData = [testData.pop()];
}

//----------------------- Run ----------
//--------------------------------------

for(let t in testData){
    tester (testData[t][0], testData[t][1]) 
}

settings.procent = (settings.pass / settings.total * 100).toFixed(2);
console.log('-------------------------------------');
console.log(`Pass: ${settings.pass} | Fail: ${settings.fail} || ${settings.procent}% T:`, new Date() - stampTime) 
console.log('-------------------------------------');