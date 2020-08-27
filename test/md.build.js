const fs = require('fs');
const simpleColorConvert = require('../simple_color_converter');
const AcceptedColors = require('../_components/_accepted_colors');

let testDataA = require('./data.test.js')


// | key       | value                         | note          |
// | ---       | ---                           | ---           |
// | color     |  '39 0 39 7'                  |  cmyk         |
// | color     |  'cmyk 39 0 39 7'             |  cmyk         |

const newLine = '\n'

function addLine (a) {
    return '|' + a.join('|') + '|' + newLine
}

function buildFooter () {
    let temp = ""

    temp += newLine
    temp += "# Expected output" + newLine
    temp += addLine(['key','value','note'])
    temp += addLine(['---','---','---'])

    const color = new AcceptedColors()
    for (const i in color) {
        const colorTemp = new simpleColorConvert({from: 'red', to: i})
        temp += addLine([i, JSON.stringify(colorTemp.color), typeof colorTemp.color])

    }

    return temp

}

function buildOutput (testDataA ) {
    let temp = ""
    temp += "# Accepted String Values. " + newLine + newLine
    temp += addLine(['key','value','note'])
    temp += addLine(['---','---','---'])

    for (let i = 0; i < testDataA.length; i++) {
        if(testDataA[i][2]){
            const colorId = testDataA[i][2].split('|')[1]
            temp += addLine([ colorId, "'" + testDataA[i][0].color + "'", colorId ])
        }
    }

    temp += buildFooter()

    return temp
}

fs.writeFile('exemple_color.md', buildOutput(testDataA ), function (err) {
    if (err) return console.log(err);
    console.log('Simple color built documentation -> push me to git -> publish to npm');
  });