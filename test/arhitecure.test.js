const _colorFactory = require("../_components/_color_paint_factory");
const colorConvertor = require("../simple_color_converter")

function Compare(a, b) {
    return JSON.stringify(a) === JSON.stringify(b)
}

function BuildColor (from,to) {
    let temp = {}
    temp[from] = colorSample[from]
    temp.to = to
    temp.debug = true
    
    return temp
}

function logEr(from,to) {
    let ColorRaw = new colorConvertor(BuildColor(from, to))
    let ColorTemp = ColorRaw.color
    let ColorCompare = Compare(ColorTemp, colorSample[to])
    if(!ColorCompare){
        console.log(i, from, to, ColorCompare)
        console.log('--------------------------------------')
        console.log(ColorRaw.to)
        console.log('expected:',colorSample[to], 'result:',ColorTemp)
        console.log('--------------------------------------')
    } else {
        console.log(i, from, to, ColorCompare)
        console.log(ColorTemp)
    }

}

const factoryKeys = Object.keys(_colorFactory);
//default color sample 
const colorSample = {
    'cmyk': {c: 8, m: 0, y: 71, k: 34},
    'grayscale': 59,
    'hex3': "9A3",
    'hex6': "9BA831",
    'lab': {l:65.818, a:-20.516, b:56.946},
    'hsl': {h:67, s:55.6, l:42.4},
    'ral': {lrv: 28, name: "Olive yellow", ral: 1020},
    'rgb': {r: 154, g: 168, b: 48},
    'w': 578,
    'xyz': {x: 27.862, y: 35.089, z: 8.101}
}

let i = 0
let stopAt = false

// arg is 
if(process.argv.length === 3){
    stopAt = parseInt(process.argv[2]);
}

for(let a of factoryKeys){
    for(let b of factoryKeys){
        i++

        if (stopAt){ 
            if (stopAt == i) {
                logEr(a,b)  
            }
        } else {
            logEr(a,b)
        }
    }
}

