// const deltaE        = require('../compare_colors/deltaE_CIEDE2000.js')
// const deltaE        = require('../compare_colors/deltaE_CIEDE2000A.js')
const deltaE        = require('../compare_colors/deltaE_CIE76.js')

const htmlPattern   = require('../color_list/html.json')
const pantonePattern= require('../color_list/pantone.json')
const ralPattern    = require('../color_list/ral.json')
const AcceptedColors = require('./_accepted_colors')

const _removeFromArray = require('../_components/frame/_remove_array_from_array')

const colorConvertor = new AcceptedColors()

// 0 | --- factory worker

colorConvertor.keys = Object.keys(colorConvertor)

colorConvertor.keysFilterd = _removeFromArray(colorConvertor.keys,['ral', 'pantone', 'grayscale', 'hex3', 'hex4', 'rgba'])

function splitCamelCase(name){
    return name.replace(/([A-Z])/g, ' $1').trim()
}

function PullDataFromList(listName, coloType, refeance, query = 'name'){
    const temp = listName.filter(a => a[query] === refeance )
    return (temp.length) ? temp[0][coloType] : false 
}

function doubleString(string){
    let temp = ''
    for (let index = 0; index < string.length; index++) {
        temp += string[index] + string[index]
    }
    return temp.toUpperCase()
}

function makeNumeric(inputNumber){
    const temp = parseInt(inputNumber)
    return isNaN(temp) ? 0 : temp
}

// 1 | --- CMYK ---------------------------------------------------------
colorConvertor.cmyk.rgb = function(cmyk){
    return {
        r: Math.round(255 * ( 1 - cmyk.c / 100 ) * ( 1 - cmyk.k / 100 )),
        g: Math.round(255 * ( 1 - cmyk.m / 100 ) * ( 1 - cmyk.k / 100 )),
        b: Math.round(255 * ( 1 - cmyk.y / 100 ) * ( 1 - cmyk.k / 100 )),
    }
}

// 2 | --- Grayscale -----------------------------------------------------
colorConvertor.grayscale.cmyk = function (grayscale) {
    return {c: 0, m: 0, y: 0, k: grayscale}
}

colorConvertor.grayscale.rgb = function (grayscale) {
    grayscale =  Math.round((100 - grayscale) / 0.392156862745098)
    return {r: grayscale, g: grayscale, b: grayscale}
}

colorConvertor.grayscale.w = function (grayscale) {
    return {error: 'You can`t get the wavelength of no color'}
}

// 3 | --- Hex 3 ---------------------------------------------------------
colorConvertor.hex3.hex6 = function (hex3) {
    return doubleString(hex3)
}

// 4 | --- Hex 4 -----------------------------------------------------
colorConvertor.hex4.hex8 = function (hex4) {
    return doubleString(hex4)
}

// 5 | --- Hex 6 -----------------------------------------------------
colorConvertor.hex6.hex3 = function (hex6) {
    function convertor (a,b) {
        let temp = ''
        temp = [a, b].join('')
        temp = Math.floor(parseInt(temp, 16)/16)
        return temp.toString(16).toUpperCase()
    }
    return convertor(hex6[0], hex6[1]) + convertor(hex6[2], hex6[3]) + convertor(hex6[4], hex6[5])
}

colorConvertor.hex6.hex4 = function (hex6){
    return (colorConvertor.hex6.hex3(hex6) + 'F')
}

colorConvertor.hex6.hex8 = function (hex6) {
    return (hex6 + 'FF').toUpperCase()
}

colorConvertor.hex6.rgb = function (hex6) {
    return {
        r: parseInt(hex6.substring(0, 2), 16),
        g: parseInt(hex6.substring(2, 4), 16),
        b: parseInt(hex6.substring(4, 6), 16),
    }
}

// 6 | --- hex 8 -----------------------------------------------------
colorConvertor.hex8.rgb = function (hex8) {
    let temp = {
        color: colorConvertor.hex6.rgb(hex8.substring(0,6)),
        opacity: parseInt(hex8.substring(6,8), 16) / 255,
    } 

    for(let i in temp.color){
        temp.color[i] *= temp.opacity
        temp.color[i] = Math.round(temp.color[i])
    } 

    return temp.color
}

colorConvertor.hex8.rgba = function (hex8) {
    const temp = colorConvertor.hex6.rgb(hex8.substring(0,6))
    temp.a = Number((parseInt(hex8.substring(6,8), 16) / 255).toFixed(2))

    return temp
}

// 7 | --- html  -----------------------------------------------------
colorConvertor.html.rgb = function(html){
    return PullDataFromList(htmlPattern, 'rgb', html )
}

// 8 | --- hsl -----------------------------------------------------
colorConvertor.hsl.rgb = function (hsl) {
    let rgb = { r: 0, g: 0, b: 0, }

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
    } else if (hsl.h < 2) {
        rgb.r = hsl.x
        rgb.g = hsl.c
    } else if (hsl.h < 3) {
        rgb.g = hsl.c
        rgb.b = hsl.x
    } else if (hsl.h < 4) {
        rgb.g = hsl.x
        rgb.b = hsl.c
    } else if (hsl.h < 5) {
        rgb.r = hsl.x
        rgb.b = hsl.c
    } else {
        rgb.r = hsl.c
        rgb.b = hsl.x
    }

    hsl.m = hsl.l - hsl.c / 2
    for(let i of 'rgb') {
        rgb[i] = Math.round((rgb[i] + hsl.m) * 255)
    }

    return rgb
}

colorConvertor.hsl.w = function (hsl) {
    return Math.round(620 - 170 / 270 * hsl.h)
}

// 9 | --- hsv -----------------------------------------------------
colorConvertor.hsv.rgb = function (hsv) {
    hsv.h /=  360
    hsv.s /=  100
    hsv.v /=  100

    const i = Math.floor(hsv.h * 6)
    const f = hsv.h * 6 - i
    const p = hsv.v * (1 - hsv.s)
    const q = hsv.v * (1 - f * hsv.s)
    const t = hsv.v * (1 - (1 - f) * hsv.s)
  
    switch (i % 6) {
      case 0: 
        return { r: hsv.v * 255, g: t * 255, b: p * 255 }
      case 1: 
        return { r: q * 255, g: hsv.v * 255, b: p * 255 }
      case 2: 
        return { r: p * 255, g: hsv.v * 255, b: t * 255 }
      case 3: 
        return { r: p * 255, g: q * 255, b: hsv.v * 255 }
      case 4: 
        return { r: t * 255, g: p * 255, b: hsv.v * 255 }
      case 5: 
        return { r: hsv.v * 255, g: p * 255, b: q * 255 }
    }
  
    return { r: r * 255, g: g * 255, b: b * 255 }
}

// 10 | --- Lab -----------------------------------------------------
colorConvertor.lab.pantone = function(labOrigin){
    const lab = Object.create(labOrigin)
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
        position: ralPattern.length - 1
    }
   
    for(let ral in ralPattern){
        let t = deltaE(ralPattern[ral].lab, lab)
        if(t < temp.index){
            temp.index = t
            temp.position = ral
            if(temp.index === 0) {
                return { 
                    ral: ralPattern[temp.position].ral,
                    name: splitCamelCase(ralPattern[temp.position].name), 
                    lrv: ralPattern[temp.position].LRV,
                }
            }
        } 
    }

    return { 
        ral: ralPattern[temp.position].ral,
        name: splitCamelCase(ralPattern[temp.position].name), 
        lrv: ralPattern[temp.position].LRV,
    }
}

colorConvertor.lab.rgb = function (lab) {
    let xyz = { x: 0, y:0 , z: 0 }

    xyz.y = (lab.l + 16) / 116,
    xyz.x = lab.a / 500 + xyz.y,
    xyz.z = xyz.y - lab.b / 200,

    xyz.x = 0.95047 * ((Math.pow(xyz.x,3) > 0.008856) ? Math.pow(xyz.x,3) : (xyz.x - 16/116) / 7.787)
    xyz.y = 1.00000 * ((Math.pow(xyz.y,3) > 0.008856) ? Math.pow(xyz.y,3) : (xyz.y - 16/116) / 7.787)
    xyz.z = 1.08883 * ((Math.pow(xyz.z,3) > 0.008856) ? Math.pow(xyz.z,3) : (xyz.z - 16/116) / 7.787)

    let rgb = { r: 0, g: 0, b: 0 }
    rgb.r = xyz.x *  3.2406 + xyz.y * -1.5372 + xyz.z * -0.4986
    rgb.g = xyz.x * -0.9689 + xyz.y *  1.8758 + xyz.z *  0.0415
    rgb.b = xyz.x *  0.0557 + xyz.y * -0.2040 + xyz.z *  1.0570

    for(let i of 'rgb') {
        rgb[i] = (rgb[i] > 0.0031308) ? (1.055 * Math.pow(rgb[i], 1/2.4) - 0.055) : 12.92 * rgb[i]
        rgb[i] = Math.round(Math.max(0, Math.min(1, rgb[i])) * 255)
    }

    return rgb
}

// 11 | --- Pantone -----------------------------------------------------
colorConvertor.pantone.rgb = function (pantone) {
    return PullDataFromList(pantonePattern, 'rgb', pantone )
}

colorConvertor.pantone.cmyk = function (pantone) {
    return PullDataFromList(pantonePattern, 'cmyk', pantone )
}

colorConvertor.pantone.lab = function (pantone) {
    return PullDataFromList(pantonePattern, 'lab', pantone )
}

// 12 | --- Ral -----------------------------------------------------
colorConvertor.ral.rgb = function (ral) {
    return PullDataFromList(ralPattern, 'rgb', ral, 'ral')
}

colorConvertor.ral.cmyk = function (ral) {
    return PullDataFromList(ralPattern, 'cmyk', ral, 'ral')
}

colorConvertor.ral.lab = function (ral) {
    return PullDataFromList(ralPattern, 'lab', ral, 'ral')
}

// 13 | --- rgb -----------------------------------------------------
colorConvertor.rgb.hex6 = function (rgb) {
    function rgbNormalize (color) {
        color = makeNumeric(color)

        if (color < 16) {
            color = '0' + Number(color).toString(16)
        } else {
            color = color.toString(16)
        }

        return color
    }
    return [rgbNormalize(rgb.r), rgbNormalize(rgb.g), rgbNormalize(rgb.b)].join('').toUpperCase()
}

colorConvertor.rgb.rgba = function (rgb) {
    rgb.a = 1
    return rgb
}

colorConvertor.rgb.hsl = function (rgb) {
    let hsl = { h:0, s:0, l:0 }
    for(let i of 'rgb') {
        rgb[i] /= 255
    }

    // Min Max chanel val
    rgb.cmin = Math.min(rgb.r,rgb.g,rgb.b)
    rgb.cmax = Math.max(rgb.r,rgb.g,rgb.b)
    rgb.delta = rgb.cmax - rgb.cmin

    // Calculate hue
    if (rgb.delta === 0) {
        hsl.h = 0
    } else if (rgb.cmax === rgb.r){
        hsl.h =  Math.round((((rgb.g - rgb.b) / rgb.delta) % 6) * 60)
    } else if (rgb.cmax === rgb.g) {
        hsl.h =  Math.round(((rgb.b - rgb.r) / rgb.delta + 2) * 60)
    } else {
        hsl.h =  Math.round(((rgb.r - rgb.g) / rgb.delta + 4) * 60)
    }    
    
    // Make negative hues positive behind 360°
    hsl.h = (hsl.h < 0)? hsl.h + 360 : hsl.h

    hsl.l = (rgb.cmax + rgb.cmin) / 2

    hsl.s = rgb.delta === 0 ? 0 : rgb.delta / (1 - Math.abs(2 * hsl.l - 1))
              
    hsl.s = +(hsl.s * 100).toFixed(1)
    hsl.l = +(hsl.l * 100).toFixed(1)
        
    return hsl
}

colorConvertor.rgb.hsv = function (rgb) {
    for(let i of 'rgb') {
        rgb[i] /= 255
    }

    const minRGB = Math.min(rgb.r, Math.min(rgb.g, rgb.b))
    const maxRGB = Math.max(rgb.r, Math.max(rgb.g, rgb.b))
    let hsv = false

    if (minRGB === maxRGB) {
        // grayscale
        hsv = {
            h: 0,
            s: 0,
            v: minRGB * 100
        }
    } else {
        // color
        let d = ( rgb.r === minRGB) ? rgb.g - rgb.b : ((rgb.b === minRGB) ? rgb.r - rgb.g : rgb.b - rgb.r)
        let h = ( rgb.r === minRGB) ? 3 : (( rgb.b === minRGB) ? 1 : 5)
        hsv = {
            h: 60 * ( h - d / (maxRGB - minRGB)),
            s: (( maxRGB - minRGB ) / maxRGB ) * 100,
            v: (maxRGB) * 100
        }
    }

    return hsv
}

colorConvertor.rgb.grayscale = function (rgb) {
    for(let i of 'rgb') {
        rgb[i] = 255 - rgb[i]
    }
    return Math.round(((0.3 * rgb.r) + (0.59 * rgb.g) + (0.11 * rgb.b))/ 2.56)
}

colorConvertor.rgb.lab = function (rgb) {
    for(let i of 'rgb') {
        rgb[i] /= 255
    }

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

colorConvertor.rgb.cmyk = function (rgb){
    let cmyk = { c: 0, m: 0, y: 0, k: 0, }

    if (rgb.r === 0 && rgb.g === 0 && rgb.b === 0) {
        cmyk.k = 100
    } else {

        for(let i of 'rgb') {
            rgb[i] /= 255
        }

        cmyk.k = 1 - Math.max(rgb.r, rgb.g, rgb.b)

        if (cmyk.k !== 1) {
            cmyk.c = (1 - rgb.r - cmyk.k) / (1 - cmyk.k)
            cmyk.m = (1 - rgb.g - cmyk.k) / (1 - cmyk.k)
            cmyk.y = (1 - rgb.b - cmyk.k) / (1 - cmyk.k)

            for(let i of 'cmyk'){
                cmyk[i] = Math.round(cmyk[i] * 100)
            }
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
            temp.html = splitCamelCase(htmlPattern[html].name)
            if(temp.index === 0) {
                return temp.html
            }
        }
    }

    return temp.html
}

colorConvertor.rgb.xyz = function(rgb) {
    function pivot(n) {
        return (n > 0.04045 ? Math.pow((n + 0.055) / 1.055, 2.4) : n / 12.92) * 100.0
    }

    for(let i of 'rgb'){
        rgb[i] = pivot(rgb[i] / 255.0)
    }
       
    return {
        x: rgb.r * 0.4124 + rgb.g * 0.3576 + rgb.b * 0.1805, 
        y: rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722, 
        z: rgb.r * 0.0193 + rgb.g * 0.1192 + rgb.b * 0.9505
    }

}

// 14 | --- rgba -----------------------------------------------------
colorConvertor.rgba.rgb = function(rgba){
    let temp = {}

    for(let i of 'rgb'){
        temp[i] = Math.round(rgba[i] * rgba.a)
    }

    return temp
}

// 15 | --- w -----------------------------------------------------
colorConvertor.w.rgb = function(w) {
    let rgb = { r: 0, g: 0, b: 0, }

     if (w >= 380 && w < 440) {
         rgb.r = -1 * (w - 440) / (440 - 380)
         rgb.b = 1
    } else if (w >= 440 && w < 490) {
        rgb.g = (w - 440) / (490 - 440)
        rgb.b = 1
     } else if (w >= 490 && w < 510) {
         rgb.g  = 1
         rgb.b = -1 * (w - 510) / (510 - 490)
     } else if (w >= 510 && w < 580) {
         rgb.r = (w - 510) / (580 - 510)
         rgb.g = 1
     } else if (w >= 580 && w < 645) {
         rgb.r = 1
         rgb.g = -1 * (w - 645) / (645 - 580)
     } else if (w >= 645 && w <= 780) {
         rgb.r = 1
     } 

     for(let i of 'rgb'){
        rgb[i] = Math.round(rgb[i] * 255)
    }

     return rgb
}

// 16 | --- XYZ -----------------------------------------------------
colorConvertor.xyz.lab = function(xyz) {   
    function pivot(n) {
        return n > 0.008856 ? Math.pow(n, 0.3333) : (903.3 * n + 16) / 116
    }

    const x = pivot(xyz.x / 95.047)
    const y = pivot(xyz.y / 100.000)
    const z = pivot(xyz.z / 108.883)
   
    return {
        l: Math.max(0, 116 * y - 16), 
        a: 500 * (x - y), 
        b: 200 * (y - z)
    }
}

module.exports = colorConvertor