const ralPattern = require('./compiled_ral.json')
const pantonePattern = require('./compiled_pantone.json')

const colorConvertor = {}
const _this = colorConvertor

// --- hex 6
colorConvertor.hex6 = {}
colorConvertor.hex6.hex3 = function (hex6) {
    function convertor (a,b) {
        let temp = ''
        temp = [a, b].join('')
        temp = parseInt(temp, 16)/16
        temp = Math.floor(temp)
        temp = temp.toString(16)
        return temp.toUpperCase()
    }
    const temp = {
        r: convertor(hex6[0], hex6[1]),
        g: convertor(hex6[2], hex6[3]),
        b: convertor(hex6[4], hex6[5]),
    }
    return [temp.r, temp.g, temp.b].join('')
}
colorConvertor.hex6.rgb = function (hex6) {
    const temp = {
        r: parseInt(hex6.substring(0, 2), 16),
        g: parseInt(hex6.substring(2, 4), 16),
        b: parseInt(hex6.substring(4, 6), 16),
    }
    return temp 
}

colorConvertor.hex6.ral = function (hex6) {
    var temp = hex6
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.ral(temp)
    return temp
}  

colorConvertor.hex6.pantone = function (hex6) {
    var temp = hex6
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.pantone(temp)
    return temp
}  

colorConvertor.hex6.hsl = function (hex6) {
    var temp = hex6
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.hsl(temp)
    return temp
}  

colorConvertor.hex6.grayscale = function (hex6){
    temp = hex6
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.grayscale(temp)
    return temp
}

// --- hex 3
colorConvertor.hex3 = {};
colorConvertor.hex3.hex6 = function (hex3) {
    return [hex3[0],hex3[0],hex3[1],hex3[1],hex3[2],hex3[2]].join('').toUpperCase()
}

colorConvertor.hex3.rgb = function (hex3) {
    var temp = hex3
    temp = _this.hex3.hex6(temp)
    temp = _this.hex6.rgb(temp)
    return temp
}

colorConvertor.hex3.ral = function (hex3) {
    var temp = hex3,
    temp = _this.hex3.hex6(temp)
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.ral(temp)
    return temp
}

colorConvertor.hex3.pantone = function (hex3) {
    var temp = hex3,
    temp = _this.hex3.hex6(temp)
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.pantone(temp)
    return temp
}

colorConvertor.hex3.hsl = function (hex3){
    return _this.rgb.hsl(colorConvertor.hex3.rgb(hex3))
}

colorConvertor.hex3.grayscale = function (hex3){
    temp = hex3
    temp = _this.hex3.rgb(temp)
    temp = _this.rgb.grayscale(temp)
    return temp
}

// --- rgb
colorConvertor.rgb = {};
colorConvertor.rgb.hex6 = function (rgb) {
    return [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)].join('')
}
colorConvertor.rgb.hex3 = function (rgb) {
    let temp = rgb
    temp = _this.rgb.hex6(temp)
    temp = _this.hex6.hex3(temp)
    return temp.toUpperCase()
}

colorConvertor.rgb.hsl = function (rgb) {
    // Make r, g, and b fractions of 1
    rgb.r /= 255;
    rgb.g /= 255;
    rgb.b /= 255;

    // Find greatest and smallest channel values
    rgb.cmin = Math.min(rgb.r,rgb.g,rgb.b),
    rgb.cmax = Math.max(rgb.r,rgb.g,rgb.b),
    rgb.delta = rgb.cmax - rgb.cmin,
    rgb.h = 0,
    rgb.s = 0,
    rgb.l = 0;

    // Calculate hue
    // No difference
    if (rgb.delta == 0)
        rgb.h = 0;
        // Red is max
    else if (rgb.cmax === rgb.r)
        rgb.h = ((rgb.g - rgb.b) / rgb.delta) % 6;
        // Green is max
    else if (rgb.cmax === rgb.g)
        rgb.h = (rgb.b - rgb.r) / rgb.delta + 2;
        // Blue is max
        else
        rgb.h = (rgb.r - rgb.g) / rgb.delta + 4;

        rgb.h = Math.round(rgb.h * 60);
        
        // Make negative hues positive behind 360°
    if (rgb.h < 0)
        rgb.h += 360;

        rgb.l = (rgb.cmax + rgb.cmin) / 2;

            // Calculate saturation
        rgb.s = rgb.delta == 0 ? 0 : rgb.delta / (1 - Math.abs(2 * rgb.l - 1));
              
            // Multiply l and s by 100
        rgb.s = +(rgb.s * 100).toFixed(1);
        rgb.l = +(rgb.l * 100).toFixed(1);
        
        return {h: rgb.h ,s: rgb.s ,l: rgb.l }
}

colorConvertor.rgb.grayscale = function (rgb) {
    return Math.round(((0.3 * rgb.r) + (0.59 * rgb.g) + (0.11 * rgb.b))/ 2.56)
}

colorConvertor.rgb.compare = function (a,b) {
    return Math.abs(a.r - b.r ) + Math.abs(a.g - b.g ) + Math.abs(a.b - b.b )
}

colorConvertor.rgb.ral = function (rgb){
    let temp = {
        index: 768,
        ral: '',
        name: '',
    }

    for(let ral in ralPattern){
        let t = colorConvertor.rgb.compare(ralPattern[ral].rgb, rgb)
        if(t < temp.index){
            temp.index = t
            temp.ral = ralPattern[ral].ral
            temp.name = ralPattern[ral].name
            if(temp.index === 0) {
                return {ral: temp.ral,  name: temp.name,}
            }
        }
    }

    return {ral: temp.ral,  name: temp.name,}
}

colorConvertor.rgb.pantone = function(rgb){
    let temp = {
        index: 768,
        pantone: '',
    }

    for(let pantone in pantonePattern){
        let t = Math.abs(pantonePattern[pantone].rgb.r - rgb.r ) + Math.abs(pantonePattern[pantone].rgb.g - rgb.g ) + Math.abs(pantonePattern[pantone].rgb.b - rgb.b )
        if(t < temp.index){
            temp.index = t
            temp.pantone = pantonePattern[pantone].pantone
            if(temp.index === 0) {
                return temp
            }
        }
    }

    return temp.pantone
}

// --- factory cleaning squad
const factoryCleanar = {}
factoryCleanar.from = function (objectData) {
    if(objectData.hasOwnProperty('hex')){
        objectData.hex6 = objectData.hex
    }
    return Object.keys(objectData).filter(from => ['hex6', 'hex3', 'rgb', 'ral', 'pantone', 'hsl', 'grayscale'].indexOf(from) > -1  )[0]
} 

factoryCleanar.hex = function (hex) {
    return hex.toLowerCase().replace(/[^a-f,^0-9]/g,'')
}

factoryCleanar.to = function (to) {
    switch (to) {
        case 'hex6':
        case 'hex3':
        case 'rgb': 
        case 'ral': 
        case 'hsl':
        case 'pantone':
        case 'grayscale':    
            return to
        case 'hex':
            return 'hex6'
        default:
            return ''
    }
}

// factory
const colorFactory = function (settings) {
    
    settings.from = factoryCleanar.from(settings)
    settings.to =  factoryCleanar.to(settings.to)
    if (settings.from === settings.to) { 
        settings.output = settings[settings.from]
        return settings
    }

    if(settings.from === 'hex' || settings.from === 'hex6' || settings.from === 'hex3'){
        settings[settings.from] = factoryCleanar.hex(settings[settings.from])
    }

    settings.output = colorConvertor[settings.from][settings.to](settings[settings.from])
    return settings.output 
}

module.exports = colorFactory;