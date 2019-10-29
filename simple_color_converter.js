const ralPattern = require('./color_data/compiled_ral.json')
const pantonePattern = require('./color_data/compiled_pantone.json')
const htmlPattern = require('./color_data/compiled_html.json')
// const color_identifier = require('./color_identifier.js')

const colorConvertor = {
    cmyk: {},
    grayscale: {},
    hex3: {},
    hex6: {},
    hsl: {},
    rgb: {},
    xyz: {},
}

const _this = colorConvertor
let error = ''


// 1 | --- CMYK

colorConvertor.cmyk.grayscale = function(cmyk){
    temp = cmyk
    temp = _this.cmyk.rgb(temp)
    temp = _this.rgb.grayscale(temp)

    return temp
}

colorConvertor.cmyk.hex3 = function(cmyk){
    temp = cmyk
    temp = _this.cmyk.rgb(temp)
    temp = _this.rgb.hex3(temp)

    return temp
}

colorConvertor.cmyk.hex6 = function(cmyk){
    temp = cmyk
    temp = _this.cmyk.rgb(temp)
    temp = _this.rgb.hex6(temp)

    return temp
}

colorConvertor.cmyk.hsl = function(cmyk){
    temp = cmyk
    temp = _this.cmyk.rgb(temp)
    temp = _this.rgb.hsl(temp)

    return temp
}

colorConvertor.cmyk.html = function(cmyk){
    temp = cmyk
    temp = _this.cmyk.rgb(temp)
    temp = _this.rgb.html(temp)

    return temp
}

colorConvertor.cmyk.pantone = function(cmyk){
    temp = cmyk
    temp = _this.cmyk.rgb(temp)
    temp = _this.rgb.pantone(temp)

    return temp
}

colorConvertor.cmyk.ral = function(cmyk){
    temp = cmyk
    temp = _this.cmyk.rgb(temp)
    temp = _this.rgb.ral(temp)

    return temp
}

colorConvertor.cmyk.rgb = function(cmyk){
    let rgb = {
        r: 0,
        g: 0,
        b: 0,
    }
    
    rgb.r = Math.round(255 * ( 1 - cmyk.c / 100 ) * ( 1 - cmyk.k / 100 ))
    rgb.g = Math.round(255 * ( 1 - cmyk.m / 100 ) * ( 1 - cmyk.k / 100 ))
    rgb.b = Math.round(255 * ( 1 - cmyk.y / 100 ) * ( 1 - cmyk.k / 100 ))

    return rgb
}

colorConvertor.cmyk.w = function (cmyk) {
    let temp = hex6
    temp = _this.cmyk.hsl(temp)
    temp = _this.hsl.w(temp)
    return temp
}

colorConvertor.cmyk.xyz = function (cmyk) {
    let temp = cmyk
    temp = _this.cmyk.rgb(temp)
    temp = _this.rgb.xyz(temp)
    return temp
}

// 2 | --- grayscale

colorConvertor.grayscale.cmyk = function (grayscale) {
    return {c: 0, m: 0, y: 0, k: grayscale}
}

colorConvertor.grayscale.hex3 = function (grayscale) {
    temp = grayscale
    temp = _this.grayscale.rgb(temp)
    temp = _this.rgb.hex3(temp)
    return temp
}

colorConvertor.grayscale.hex6 = function (grayscale) {
    temp = grayscale
    temp = _this.grayscale.rgb(temp)
    temp = _this.rgb.hex6(temp)
    return temp
}

colorConvertor.grayscale.hsl = function (grayscale) {
    temp = grayscale
    temp = _this.grayscale.rgb(temp)
    temp = _this.rgb.hsl(temp)
    return temp
}

colorConvertor.grayscale.html = function (grayscale) {
    temp = grayscale
    temp = _this.grayscale.rgb(temp)
    temp = _this.rgb.html(temp)
    return temp
}

colorConvertor.grayscale.pantone = function (grayscale) {
    temp = grayscale
    temp = _this.grayscale.rgb(temp)
    temp = _this.rgb.pantone(temp)
    return temp
}

colorConvertor.grayscale.ral = function (grayscale) {
    temp = grayscale
    temp = _this.grayscale.rgb(temp)
    temp = _this.rgb.ral(temp)
    return temp
}

colorConvertor.grayscale.rgb = function (grayscale) {
    grayscale /=  100
    grayscale *= 255
    grayscale = Math.round(grayscale)
    return {r: grayscale, g: grayscale, b: grayscale}
}

colorConvertor.grayscale.w = function (grayscale) {
    return {error: 'You can`t get the wavelength of no color'}
}

colorConvertor.grayscale.xyz = function (grayscale) {
    let temp = grayscale
    temp = _this.grayscale.rgb(temp)
    temp = _this.rgb.xyz(temp)
    return temp
}

// 3 | --- hex 3
colorConvertor.hex3.hex6 = function (hex3) {
    return [hex3[0],hex3[0],hex3[1],hex3[1],hex3[2],hex3[2]].join('').toUpperCase()
}

colorConvertor.hex3.rgb = function (hex3) {
    let temp = hex3
    temp = _this.hex3.hex6(temp)
    temp = _this.hex6.rgb(temp)
    return temp
}

colorConvertor.hex3.ral = function (hex3) {
    let temp = hex3
    temp = _this.hex3.hex6(temp)
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.ral(temp)
    return temp
}

colorConvertor.hex3.pantone = function (hex3) {
    let temp = hex3,
    temp = _this.hex3.hex6(temp)
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.pantone(temp)
    return temp
}

colorConvertor.hex3.hsl = function (hex3){
    return _this.rgb.hsl(colorConvertor.hex3.rgb(hex3))
}

colorConvertor.hex3.grayscale = function (hex3){
    let temp = hex3
    temp = _this.hex3.rgb(temp)
    temp = _this.rgb.grayscale(temp)
    return temp
}

colorConvertor.hex3.hex3Grayscale = function (hex3){
    let temp = hex3
    temp = _this.hex3.rgb(temp)
    temp = _this.rgb.rgbGrayscale(temp)
    temp = _this.rgb.hex3(temp)
    return temp
}

colorConvertor.hex3.cmyk =  function (hex3){
    let temp = hex3
    temp = _this.hex3.rgb(temp)
    temp = _this.rgb.cmyk(temp)
    return temp
}

colorConvertor.hex3.html = function(hex3){
    temp = hex3
    temp = _this.hex3.rgb(temp)
    temp = _this.rgb.html(temp)
    return temp
}

colorConvertor.hex3.w = function (hex3) {
    let temp = hex3
    temp = _this.hex3.hsl(temp)
    temp = _this.hsl.w(temp)
    return temp
}

colorConvertor.hex3.xyz = function (hex3) {
    let temp = hex3
    temp = _this.hex3.rgb(temp)
    temp = _this.rgb.xyz(temp)
    return temp
}

// 4 | --- hex 6
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
    let temp = hex6
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.pantone(temp)
    return temp
}  

colorConvertor.hex6.hsl = function (hex6) {
    let temp = hex6
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.hsl(temp)
    return temp
}  

colorConvertor.hex6.grayscale = function (hex6){
    let temp = hex6
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.grayscale(temp)
    return temp
}

colorConvertor.hex6.hex6Grayscale = function (hex6) {
    let temp = hex6
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.rgbGrayscale(temp)
    temp = _this.rgb.hex6(temp)
    return temp
}

colorConvertor.hex6.cmyk =  function (hex6){
    let temp = hex6
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.cmyk(temp)
    return temp
}

colorConvertor.hex6.html = function (hex6) {
    temp = hex6
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.html(temp)

    return temp
}

colorConvertor.hex6.w = function (hex6) {
    let temp = hex6
    temp = _this.hex6.hsl(temp)
    temp = _this.hsl.w(temp)
    return temp
}

colorConvertor.hex6.xyz = function (hex6) {
    let temp = hex6
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.xyz(temp)
    return temp
}

// 5 | --- hsl
colorConvertor.hsl.cmyk = function (hsl) {
    temp = hsl
    temp = _this.hsl.rgb(temp)
    temp = _this.rgb.cmyk(temp)
    return temp
}

colorConvertor.hsl.grayscale = function (hsl) {
    temp = hsl
    temp = _this.hsl.rgb(temp)
    temp = _this.rgb.grayscale(temp)
    return temp
}

colorConvertor.hsl.hex3 = function (hsl) {
    temp = hsl
    temp = _this.hsl.rgb(temp)
    temp = _this.rgb.hex3(temp)
    return temp
}

colorConvertor.hsl.hex6 = function (hsl) {
    temp = hsl
    temp = _this.hsl.rgb(temp)
    temp = _this.rgb.hex6(temp)
    return temp
}

colorConvertor.hsl.html = function (hsl) {
    temp = hsl
    temp = _this.hsl.rgb(temp)
    temp = _this.rgb.html(temp)
    return temp
}

colorConvertor.hsl.pantone = function (hsl) {
    temp = hsl
    temp = _this.hsl.rgb(temp)
    temp = _this.rgb.pantone(temp)
    return temp
}

colorConvertor.hsl.ral = function (hsl) {
    temp = hsl
    temp = _this.hsl.rgb(temp)
    temp = _this.rgb.ral(temp)
    return temp
}

colorConvertor.hsl.rgb = function (hsl) {
    const rgb = {
        r: 0,
        g: 0,
        b: 0,
    }

    hsl.h /= 60
    if (hsl.h < 0) {
        hsl.h = 6 - (-hsl.h % 6)
    }
    hsl.h %= 6

    hsl.s = Math.max(0, Math.min(1, hsl.s / 100))
    hsl.l = Math.max(0, Math.min(1, hsl.l / 100))

    hsl.c = (1 - Math.abs((2 * hsl.l) - 1)) * hsl.s
    hsl.x = hsl.c * (1 - Math.abs((hsl.h % 2) - 1))

    if (hsl.h < 1) {
        rgb.r = hsl.c
        rgb.g = hsl.x
        rgb.b = 0
    } else if (hsl.h < 2) {
        rgb.r = hsl.x
        rgb.g = hsl.c
        rgb.b = 0
    } else if (hsl.h < 3) {
        rgb.r = 0
        rgb.g = hsl.c
        rgb.b = hsl.x
    } else if (hsl.h < 4) {
        rgb.r = 0
        rgb.g = hsl.x
        rgb.b = hsl.c
    } else if (hsl.h < 5) {
        rgb.r = hsl.x
        rgb.g = 0
        rgb.b = hsl.c
    } else {
        rgb.r = hsl.c
        rgb.g = 0
        rgb.b = hsl.x
    }

    hsl.m = hsl.l - hsl.c / 2
    rgb.r = Math.round((rgb.r + hsl.m) * 255)
    rgb.g = Math.round((rgb.g + hsl.m) * 255)
    rgb.b = Math.round((rgb.b + hsl.m) * 255)

    return rgb
}

colorConvertor.hsl.w = function (hsl) {
    let temp = Math.round(620 - 170 / 270 * hsl.h)
    
    return temp
}

colorConvertor.hsl.xyz = function (hsl) {
    let temp = hsl
    temp = _this.hsl.rgb(temp)
    temp = _this.rgb.xyz(temp)
    return temp
}

// 6 | --- rgb
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
    rgb.r /= 255
    rgb.g /= 255
    rgb.b /= 255

    // Find greatest and smallest channel values
    rgb.cmin = Math.min(rgb.r,rgb.g,rgb.b),
    rgb.cmax = Math.max(rgb.r,rgb.g,rgb.b),
    rgb.delta = rgb.cmax - rgb.cmin,
    rgb.h = 0,
    rgb.s = 0,
    rgb.l = 0

    // Calculate hue
    // No difference
    if (rgb.delta == 0)
        rgb.h = 0
        // Red is max
    else if (rgb.cmax === rgb.r)
        rgb.h = ((rgb.g - rgb.b) / rgb.delta) % 6
        // Green is max
    else if (rgb.cmax === rgb.g)
        rgb.h = (rgb.b - rgb.r) / rgb.delta + 2
        // Blue is max
        else
        rgb.h = (rgb.r - rgb.g) / rgb.delta + 4

        rgb.h = Math.round(rgb.h * 60)
        
        // Make negative hues positive behind 360°
    if (rgb.h < 0)
        rgb.h += 360

        rgb.l = (rgb.cmax + rgb.cmin) / 2

            // Calculate saturation
        rgb.s = rgb.delta == 0 ? 0 : rgb.delta / (1 - Math.abs(2 * rgb.l - 1))
              
            // Multiply l and s by 100
        rgb.s = +(rgb.s * 100).toFixed(1)
        rgb.l = +(rgb.l * 100).toFixed(1)
        
        return {h: rgb.h ,s: rgb.s ,l: rgb.l }
}

colorConvertor.rgb.grayscale = function (rgb) {
    return Math.round(((0.3 * rgb.r) + (0.59 * rgb.g) + (0.11 * rgb.b))/ 2.56)
}

colorConvertor.rgb.rgbGrayscale = function (rgb) {
    const temp = Math.round((0.3 * rgb.r) + (0.59 * rgb.g) + (0.11 * rgb.b))
    return {r: temp, g: temp, b: temp}
}

colorConvertor.rgb.compare = function (a,b) {
    return Math.abs(a.r - b.r ) + Math.abs(a.g - b.g ) + Math.abs(a.b - b.b )
}

colorConvertor.rgb.cmyk = function (rgb){
    let cmyk = {
        c: 0,
        m: 0,
        y: 0,
        k: 0,
    }

    if (rgb.r === 0 && rgb.g === 0 && rgb.b === 0) {
        cmyk.k = 100;
    } else {

        rgb.r = rgb.r / 255;
        rgb.g = rgb.g / 255;
        rgb.b = rgb.b / 255;

        cmyk.k = 1 - Math.max(rgb.r, rgb.g, rgb.b);

        if (cmyk.k == 1) {
            cmyk.c = 0;
            cmyk.m = 0;
            cmyk.y = 0;
        } else {
            cmyk.c = (1 - rgb.r - cmyk.k) / (1 - cmyk.k);
            cmyk.m = (1 - rgb.g - cmyk.k) / (1 - cmyk.k);
            cmyk.y = (1 - rgb.b - cmyk.k) / (1 - cmyk.k);

            cmyk.c = Math.round(cmyk.c * 100)
            cmyk.m = Math.round(cmyk.m * 100)
            cmyk.y = Math.round(cmyk.y * 100)
            cmyk.k = Math.round(cmyk.k * 100)
        }
    }
    return cmyk;
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

colorConvertor.rgb.html = function(rgb){
    let temp = {
        index: 768,
        html: '',
    }

    for(let html in htmlPattern){
        let t = Math.abs(htmlPattern[html].rgb.r - rgb.r ) + Math.abs(htmlPattern[html].rgb.g - rgb.g ) + Math.abs(htmlPattern[html].rgb.b - rgb.b )
        if(t < temp.index){
            temp.index = t
            temp.html = htmlPattern[html].name
            if(temp.index === 0) {
                return temp.html
            }
        }
    }

    return temp.html
}

colorConvertor.rgb.w = function (rgb) {
    let temp = rgb
    temp = _this.rgb.hsl(temp)
    temp = _this.hsl.w(temp)
    return temp
}

colorConvertor.rgb.xyz = function(rgb) {
    let xyz = {}
	rgb.r /= 255
	rgb.g /= 255
	rgb.b /= 255

	// assume sRGB
	rgb.r = rgb.r > 0.04045 ? Math.pow(((rgb.r + 0.055) / 1.055), 2.4) : (rgb.r / 12.92)
	rgb.g = rgb.g > 0.04045 ? Math.pow(((rgb.g + 0.055) / 1.055), 2.4) : (rgb.g / 12.92)
	rgb.b = rgb.b > 0.04045 ? Math.pow(((rgb.b + 0.055) / 1.055), 2.4) : (rgb.b / 12.92)

	xyz.x = (rgb.r * 0.41239079926595) + (rgb.g * 0.35758433938387) + (rgb.b * 0.18048078840183)
	xyz.y = (rgb.r * 0.21263900587151) + (rgb.g * 0.71516867876775) + (rgb.b * 0.072192315360733)
	xyz.z = (rgb.r * 0.019330818715591) + (rgb.g * 0.11919477979462) + (rgb.b * 0.95053215224966)

    xyz.x = xyz.x * 94.972
    xyz.y = xyz.y * 100
    xyz.z = xyz.z * 122.638
	return xyz;
};

// 7 | --- xyz

// --- factory cleaning squad
const factoryCleanar = {}
factoryCleanar.from = function (objectData) {
    let parameters = Object.keys(objectData).filter(from => ( from !== 'to'))
    
    if(parameters.indexOf('grayscale') > -1 && typeof objectData.grayscale === 'boolean') {
        parameters.splice(parameters.indexOf('grayscale'), 1); 
    }

    if(parameters.indexOf('hex') > -1) {
        parameters.splice(parameters.indexOf('hex'), 1); 
        parameters.push('hex6')
    }

    if(parameters.length === 1 && _this.hasOwnProperty(parameters[0])){
        return parameters[0]
    } else {
        error = {error: 'The color specified in from is not an accepted input'}
        return false;
    }
} 

factoryCleanar.hex = function (hex) {
    return hex.toLowerCase().replace(/[^a-f,^0-9]/g,'')
}

factoryCleanar.to = function (to, from) {
    if (!error){
        to = to.toLowerCase()
        if(_this[from].hasOwnProperty(to)){
            return to
        } else if (to === 'hex') {
            return 'hex6'
        } 
        error = {error: 'The value you want to convert to is not acceptable'}
        return false
    }

    return false
}

// factory
const colorFactory = function (settings) {
    error = ''
    // if (settings.hasOwnProperty('from')){
    //     color_identifier(settings.from)

    //     return true
    // } else {
    //     settings.from = factoryCleanar.from(settings)
    // }
    settings.from = factoryCleanar.from(settings)
    settings.to =  factoryCleanar.to(settings.to, settings.from)

    // Not so happy path :(
    if(error){
        return error
    }
    
    // From and to are identical
    if (settings.from === settings.to) { 
        settings.output = settings[settings.from]
        return settings
    }

    // I need to add a normalizer for every tipe of data not only for hex
    if(settings.from === 'hex6' || settings.from === 'hex3'){
        if (settings.hasOwnProperty('hex')){
            settings.hex6 = settings.hex
        }
        settings[settings.from] = factoryCleanar.hex(settings[settings.from])
    }
    
    // convert to grayscale
    if(settings.grayscale === true){
        settings[settings.from] = colorConvertor[settings.from][settings.from + 'Grayscale']((settings[settings.from]))
    }

    // Actual color convertor
    settings.output = colorConvertor[settings.from][settings.to](settings[settings.from])
    return settings.output 
}

module.exports = colorFactory