
const ralPattern = require('./color_list/ral.json')
const pantonePattern = require('./color_list/pantone.json')
const htmlPattern = require('./color_list/html.json')
const compareRGB = require('./compare_colors/rgb_liniar')
// const deltaE = require('./compare_colors/deltaE_CIE76')
const deltaE = require('./compare_colors/deltaE_CIEDE2000.js')
// const color_identifier = require('./color_identifier.js')

const colorConvertor = {
    cmyk: {},
    grayscale: {},
    hex3: {},
    hex6: {},
    lab: {},
    hsl: {},
    rgb: {},
    xyz: {},
}

const _this = colorConvertor
let error = ''

// 0 | ColorMixer

function colorMixer(colorData) {
    return (...pasiArray) => {
        for(let i = 1; i < pasiArray.length; i++){
            colorData = _this[pasiArray[i-1]][pasiArray[i]](colorData)
        }
        return colorData
    }
}

// 1 | --- CMYK

colorConvertor.cmyk.rgb = function(cmyk){
    let rgb = {
        r: Math.round(255 * ( 1 - cmyk.c / 100 ) * ( 1 - cmyk.k / 100 )),
        g: Math.round(255 * ( 1 - cmyk.m / 100 ) * ( 1 - cmyk.k / 100 )),
        b: Math.round(255 * ( 1 - cmyk.y / 100 ) * ( 1 - cmyk.k / 100 )),
    }

    return rgb
}

colorConvertor.cmyk.grayscale   = (data) => { return colorMixer(data)('cmyk','rgb','grayscale')}
colorConvertor.cmyk.hex3        = (data) => { return colorMixer(data)('cmyk','rgb','hex3')}
colorConvertor.cmyk.hex6        = (data) => { return colorMixer(data)('cmyk','rgb','hex6')}
colorConvertor.cmyk.hsl         = (data) => { return colorMixer(data)('cmyk','rgb','hsl')}
colorConvertor.cmyk.html        = (data) => { return colorMixer(data)('cmyk','rgb','html')}
colorConvertor.cmyk.lab         = (data) => { return colorMixer(data)('cmyk','rgb','lab')}
colorConvertor.cmyk.pantone     = (data) => { return colorMixer(data)('cmyk','lab','pantone')}
colorConvertor.cmyk.ral         = (data) => { return colorMixer(data)('cmyk','lab','ral')}
colorConvertor.cmyk.w           = (data) => { return colorMixer(data)('cmyk','rgb','w')}
colorConvertor.cmyk.xyz         = (data) => { return colorMixer(data)('cmyk','rgb','xyz')}

// 2 | --- grayscale

colorConvertor.grayscale.cmyk = function (grayscale) {
    return {c: 0, m: 0, y: 0, k: grayscale}
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

colorConvertor.grayscale.hex3       = (data) => { return colorMixer(data)('grayscale','rgb','hex3')}
colorConvertor.grayscale.hex6       = (data) => { return colorMixer(data)('grayscale','rgb','hex6')}
colorConvertor.grayscale.hsl        = (data) => { return colorMixer(data)('grayscale','rgb','hsl')}
colorConvertor.grayscale.html       = (data) => { return colorMixer(data)('grayscale','rgb','html')}
colorConvertor.grayscale.lab        = (data) => { return colorMixer(data)('grayscale','rgb','lab')}
colorConvertor.grayscale.pantone    = (data) => { return colorMixer(data)('grayscale','lab','pantone')}
colorConvertor.grayscale.ral        = (data) => { return colorMixer(data)('grayscale','lab','ral')}
colorConvertor.grayscale.xyz        = (data) => { return colorMixer(data)('grayscale','rgb','xyz')}

// 3 | --- hex 3
colorConvertor.hex3.hex6 = function (hex3) {
    return [hex3[0],hex3[0],hex3[1],hex3[1],hex3[2],hex3[2]].join('').toUpperCase()
}

colorConvertor.hex3.cmyk      = (data) => { return colorMixer(data)('hex3','rgb','cmyk')}
colorConvertor.hex3.grayscale = (data) => { return colorMixer(data)('hex3','rgb','grayscale')}
colorConvertor.hex3.hsl       = (data) => { return colorMixer(data)('hex3','rgb','hsl')}
colorConvertor.hex3.html      = (data) => { return colorMixer(data)('hex3','rgb','html')}
colorConvertor.hex3.lab       = (data) => { return colorMixer(data)('hex3','rgb','lab')}
colorConvertor.hex3.pantone   = (data) => { return colorMixer(data)('hex3','lab','pantone')}
colorConvertor.hex3.ral       = (data) => { return colorMixer(data)('hex3','lab','ral')}
colorConvertor.hex3.rgb       = (data) => { return colorMixer(data)('hex3','hex6','rgb')}
colorConvertor.hex3.w         = (data) => { return colorMixer(data)('hex3','hsl','w')}
colorConvertor.hex3.xyz       = (data) => { return colorMixer(data)('hex3','rgb','xyz')}

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

colorConvertor.hex6.cmyk            = (data) => { return colorMixer(data)('hex6','rgb','cmyk')}
colorConvertor.hex6.grayscale       = (data) => { return colorMixer(data)('hex6','rgb','grayscale')}
colorConvertor.hex6.hsl             = (data) => { return colorMixer(data)('hex6','rgb','hsl')}
colorConvertor.hex6.html            = (data) => { return colorMixer(data)('hex6','rgb','html')}
colorConvertor.hex6.lab             = (data) => { return colorMixer(data)('hex6','rgb','lab')}
colorConvertor.hex6.pantone         = (data) => { return colorMixer(data)('hex6','lab','pantone')}
colorConvertor.hex6.ral             = (data) => { return colorMixer(data)('hex6','lab','ral')}
colorConvertor.hex6.w               = (data) => { return colorMixer(data)('hex6','hsl','w')}
colorConvertor.hex6.xyz             = (data) => { return colorMixer(data)('hex6','rgb','xyz')}


colorConvertor.hex6.hex6Grayscale = function (hex6) {
    let temp = hex6
    temp = _this.hex6.rgb(temp)
    temp = _this.rgb.rgbGrayscale(temp)
    temp = _this.rgb.hex6(temp)
    return temp
}

// 5 | --- hsl

colorConvertor.hsl.cmyk        = (data) => { return colorMixer(data)('hsl','rgb','cmyk')}
colorConvertor.hsl.grayscale   = (data) => { return colorMixer(data)('hsl','rgb','grayscale')}
colorConvertor.hsl.hex3        = (data) => { return colorMixer(data)('hsl','rgb','hex3')}
colorConvertor.hsl.hex6        = (data) => { return colorMixer(data)('hsl','rgb','hex6')}
colorConvertor.hsl.html        = (data) => { return colorMixer(data)('hsl','rgb','html')}
colorConvertor.hsl.lab         = (data) => { return colorMixer(data)('hsl','rgb','lab')}
colorConvertor.hsl.pantone     = (data) => { return colorMixer(data)('hsl','lab','pantone')}
colorConvertor.hsl.ral         = (data) => { return colorMixer(data)('hsl','lab','ral')}
colorConvertor.hsl.xyz         = (data) => { return colorMixer(data)('hsl','rgb','xyz')}

colorConvertor.hsl.rgb = function (hslOrigin) {
    var hsl = Object.create(hslOrigin)
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

colorConvertor.hsl.w = function (hslOrigin) {
    let hsl = Object.create(hslOrigin)
    let temp = Math.round(620 - 170 / 270 * hsl.h)
    
    return temp
}

// 6 | --- html

// 7 | --- Lab

colorConvertor.lab.pantone = function(labOrigin){
    let lab = Object.create(labOrigin)
    let temp = {
        index: 768,
        name: '',
    }

    for(let pantone in pantonePattern){
       
        let t = deltaE(pantonePattern[pantone].lab, lab)
        if(t < temp.index){
            temp.index = t
            temp.name = pantonePattern[pantone].name
            if(temp.index === 1) {
                return temp.name
            }
        }
    }

    return temp.name
}

colorConvertor.lab.ral = function (lab){
    let temp = {
        index: 768,
        position: 9999
    }
   
    for(let ral in ralPattern){
        let t = deltaE(ralPattern[ral].lab, lab)
        if(t < temp.index){
            temp.index = t
            temp.position = ral
            if(temp.index === 0) {
                return { name: ralPattern[temp.position].name }
            }
        }
    }

    return { name: ralPattern[temp.position].name }
}

colorConvertor.lab.rgb = function (lab) {
    let xyz = {
        x: 0, y:0 , z: 0 
    }

    xyz.y = (lab.l + 16) / 116,
    xyz.x = lab.a / 500 + xyz.y,
    xyz.z = xyz.y - lab.b / 200,

    xyz.x = 0.95047 * ((Math.pow(xyz.x,3) > 0.008856) ? Math.pow(xyz.x,3) : (xyz.x - 16/116) / 7.787)
    xyz.y = 1.00000 * ((Math.pow(xyz.y,3) > 0.008856) ? Math.pow(xyz.y,3) : (xyz.y - 16/116) / 7.787)
    xyz.z = 1.08883 * ((Math.pow(xyz.z,3) > 0.008856) ? Math.pow(xyz.z,3) : (xyz.z - 16/116) / 7.787)

    let rgb = { r:0, g:0, b:0 }
    rgb.r = xyz.x *  3.2406 + xyz.y * -1.5372 + xyz.z * -0.4986
    rgb.g = xyz.x * -0.9689 + xyz.y *  1.8758 + xyz.z *  0.0415
    rgb.b = xyz.x *  0.0557 + xyz.y * -0.2040 + xyz.z *  1.0570

    rgb.r = (rgb.r > 0.0031308) ? (1.055 * Math.pow(rgb.r, 1/2.4) - 0.055) : 12.92 * rgb.r
    rgb.g = (rgb.g > 0.0031308) ? (1.055 * Math.pow(rgb.g, 1/2.4) - 0.055) : 12.92 * rgb.g
    rgb.b = (rgb.b > 0.0031308) ? (1.055 * Math.pow(rgb.b, 1/2.4) - 0.055) : 12.92 * rgb.b

    rgb.r = Math.round(Math.max(0, Math.min(1, rgb.r)) * 255)
    rgb.g = Math.round(Math.max(0, Math.min(1, rgb.g)) * 255)
    rgb.b = Math.round(Math.max(0, Math.min(1, rgb.b)) * 255)

    return rgb
}

colorConvertor.lab.cmyk        = (data) => { return colorMixer(data)('lab','rgb','cmyk')}
colorConvertor.lab.grayscale   = (data) => { return colorMixer(data)('lab','rgb','grayscale')}
colorConvertor.lab.hex3        = (data) => { return colorMixer(data)('lab','rgb','hex3')}
colorConvertor.lab.hex6        = (data) => { return colorMixer(data)('lab','rgb','hex6')}
colorConvertor.lab.hsl         = (data) => { return colorMixer(data)('lab','rgb','hsl')}
colorConvertor.lab.html        = (data) => { return colorMixer(data)('lab','rgb','html')}
colorConvertor.lab.w           = (data) => { return colorMixer(data)('lab','rgb','w')}
colorConvertor.lab.xyz         = (data) => { return colorMixer(data)('lab','rgb','xyz')}

// 8 | --- ral

// 9 | --- rgb
colorConvertor.rgb.hex3 = (data) => { return colorMixer(data)('rgb','hex6','hex3')}

colorConvertor.rgb.hex6 = function (rgb) {
    function rgbNormalize (color) {
        if (color < 16) {
            color = '0' + color.toString(16)
        } else {
            color = color.toString(16)
        }

        return color
    }
    return [rgbNormalize(rgb.r), rgbNormalize(rgb.g), rgbNormalize(rgb.b)].join('').toUpperCase()
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

colorConvertor.rgb.lab = function (rgbX) {
    var rgb = Object.create(rgbX)
    rgb.r = rgb.r/255
    rgb.g = rgb.g/255
    rgb.b = rgb.b/255

    rgb.r = (rgb.r > 0.04045) ? Math.pow((rgb.r + 0.055) / 1.055, 2.4) : rgb.r / 12.92
    rgb.g = (rgb.g > 0.04045) ? Math.pow((rgb.g + 0.055) / 1.055, 2.4) : rgb.g / 12.92
    rgb.b = (rgb.b > 0.04045) ? Math.pow((rgb.b + 0.055) / 1.055, 2.4) : rgb.b / 12.92

    let xyz = { x: 0, y: 0, z: 0}

    xyz.x = (rgb.r * 0.4124 + rgb.g * 0.3576 + rgb.b * 0.1805) / 0.95047
    xyz.y = (rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722) / 1.00000
    xyz.z = (rgb.r * 0.0193 + rgb.g * 0.1192 + rgb.b * 0.9505) / 1.08883

    xyz.x = (xyz.x > 0.008856) ? Math.pow(xyz.x, 1/3) : (7.787 * xyz.x) + 16/116
    xyz.y = (xyz.y > 0.008856) ? Math.pow(xyz.y, 1/3) : (7.787 * xyz.y) + 16/116
    xyz.z = (xyz.z > 0.008856) ? Math.pow(xyz.z, 1/3) : (7.787 * xyz.z) + 16/116

  return {l:((116 * xyz.y) - 16), a: (500 * (xyz.x - xyz.y)), b: (200 * (xyz.y - xyz.z))}
}

colorConvertor.rgb.rgbGrayscale = function (rgb) {
    const temp = Math.round((0.3 * rgb.r) + (0.59 * rgb.g) + (0.11 * rgb.b))
    return {r: temp, g: temp, b: temp}
}

colorConvertor.rgb.compare = compareRGB;

colorConvertor.rgb.cmyk = function (rgb){
    let cmyk = {
        c: 0,
        m: 0,
        y: 0,
        k: 0,
    }

    if (rgb.r === 0 && rgb.g === 0 && rgb.b === 0) {
        cmyk.k = 100
    } else {

        rgb.r = rgb.r / 255
        rgb.g = rgb.g / 255
        rgb.b = rgb.b / 255

        cmyk.k = 1 - Math.max(rgb.r, rgb.g, rgb.b)

        if (cmyk.k == 1) {
            cmyk.c = 0
            cmyk.m = 0
            cmyk.y = 0
        } else {
            cmyk.c = (1 - rgb.r - cmyk.k) / (1 - cmyk.k)
            cmyk.m = (1 - rgb.g - cmyk.k) / (1 - cmyk.k)
            cmyk.y = (1 - rgb.b - cmyk.k) / (1 - cmyk.k)

            cmyk.c = Math.round(cmyk.c * 100)
            cmyk.m = Math.round(cmyk.m * 100)
            cmyk.y = Math.round(cmyk.y * 100)
            cmyk.k = Math.round(cmyk.k * 100)
        }
    }
    return cmyk
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

colorConvertor.rgb.w = (data) => { return colorMixer(data)('rgb','hsl','w')}

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
	return xyz
}


colorConvertor.rgb.ral         = (data) => { return colorMixer(data)('rgb','lab','ral')}
colorConvertor.rgb.pantone     = (data) => { return colorMixer(data)('rgb','lab','pantone')}

// 10 | --- w

// 11 | --- xyz

// --- factory cleaning squad
const factoryCleanar = {}
factoryCleanar.from = function (objectData) {
    let parameters = Object.keys(objectData).filter(from => ( from !== 'to'))
    
    if(parameters.indexOf('grayscale') > -1 && typeof objectData.grayscale === 'boolean') {
        parameters.splice(parameters.indexOf('grayscale'), 1) 
    }

    if(parameters.indexOf('hex') > -1) {
        parameters.splice(parameters.indexOf('hex'), 1) 
        parameters.push('hex6')
    }

    if(parameters.length === 1 && _this.hasOwnProperty(parameters[0])){
        return parameters[0]
    } else {
        error = {error: 'The color specified in from is not an accepted input'}
        return false
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