//----------------------- Setup --------
//--------------------------------------
const colorConvertor = require('./simple_color_converter.js');
const tester = function (input, output) {
    const color = colorConvertor(input)
    const temp = JSON.stringify(color) === JSON.stringify(output)
    console.log(temp, color)
    return temp
} 

//----------------------- Data- --------
//--------------------------------------
const test = [
    [{hex6: '000000', to: 'hex3'}, '000' ],
    [{hex6: 'ffffff', to: 'hex3'}, 'FFF' ],
    [{hex: '#ffffcc', to: 'hex3'}, 'FFC' ],
    [{hex: '#caaa96', to: 'hex3'}, 'CA9' ],
    [{hex3: '#CA9', to: 'hex6'}, 'CCAA99' ],
    [{hex6: '#caaa96', to: 'hsl'}, { h: 23, s: 32.9, l: 69 } ],
    [{hex3: '#228', to: 'hex6'}, '222288' ],
    [{rgb: {r: 12, g:75, b:175}, to: 'ral'}, { ral: 'RAL 5017', name: 'Traffic blue' }],
    [{hex6: '000000', to: 'grayscale'}, 0 ],
    [{hex3: 'FFF', to: 'grayscale'}, 100 ],
    [{rgb: { r: 68, g: 255, b: 255 }, to: 'grayscale'}, 78 ],
    [{rgb: { r: 200, g: 0, b: 14 }, to: 'grayscale'}, 24 ],
]

//----------------------- Run ----------
//--------------------------------------
for(let t in test){
    tester (test[t][0], test[t][1]) 
}

