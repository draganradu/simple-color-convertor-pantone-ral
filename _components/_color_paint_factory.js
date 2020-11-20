'use strict'

const deltaE = require('../_components/compare_deltaE_CIE76.js')
const { html, pantone, ral } = require('color_library')
const AcceptedColors = require('./_accepted_colors')

const colorConvertor = new AcceptedColors()

// 0 | --- Factory worker

function splitCamelCase(name){
    return name.replace(/([A-Z])/g, ' $1').trim()
}

function PullDataFromList(listName, coloType, reference, query = 'name'){
    const _this = listName.filter(a => a[query] === reference )
    return (_this.length) ? _this[0][coloType] : false 
}

function doubleString(string){
    let _this = ''
    for (let index = 0; index < string.length; index++) {
        _this += string[index] + string[index]
    }
    return _this.toUpperCase()
}

function makeNumeric(inputNumber){
    const _this = parseInt(inputNumber)
    return isNaN(_this) ? 0 : _this
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

colorConvertor.hex4.rgb = function (hex4) {
    const _this = {
        color: colorConvertor.hex6.rgb(colorConvertor.hex3.hex6(hex4.substring(0, 3))),
        opacity: parseInt([hex4.substring(3, 4),hex4.substring(3, 4)].join(''), 16) / 255,
    }

    for (const i in _this.color) {
        _this.color[i] *= _this.opacity
        _this.color[i] = Math.round(_this.color[i])
    }
    return _this.color
}

// 5 | --- Hex 6 -----------------------------------------------------
colorConvertor.hex6.hex3 = function (hex6) {
    function convertor (a,b) {
        let _this = ''
        _this = [a, b].join('')
        _this = Math.floor(parseInt(_this, 16)/16)
        return _this.toString(16).toUpperCase()
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
    const _this = {
        color: colorConvertor.hex6.rgb(hex8.substring(0,6)),
        opacity: parseInt(hex8.substring(6,8), 16) / 255,
    } 

    for(const i in _this.color){
        _this.color[i] *= _this.opacity
        _this.color[i] = Math.round(_this.color[i])
    } 

    return _this.color
}

colorConvertor.hex8.rgba = function (hex8) {
    const _this = colorConvertor.hex6.rgb(hex8.substring(0,6))
    _this.a = Number((parseInt(hex8.substring(6,8), 16) / 255).toFixed(2))

    return _this
}

// 7 | --- html  -----------------------------------------------------
colorConvertor.html.rgb = function(htmlInput){
    return PullDataFromList(html, 'rgb', htmlInput )
}

// 8 | --- hsl -----------------------------------------------------
colorConvertor.hsl.rgb = function (hsl) {
    const rgb = { r: 0, g: 0, b: 0, }

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
    for(const i of 'rgb') {
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
    const _this = {
        index: 768,
        name: '',
    }

    for(const elementPantone in pantone){
       
        const t = deltaE(pantone[elementPantone].lab, lab)
        if(t < _this.index){
            _this.index = t
            _this.name = pantone[elementPantone].name
            if(_this.index === 1) {
                return _this.name
            }
        }
    }

    return _this.name
}

colorConvertor.lab.ral = function (lab){
    const _this = {
        index: 768,
        position: ral.length - 1
    }
   
    for(const elementRal in ral){
        const t = deltaE(ral[elementRal].lab, lab)
        if(t < _this.index){
            _this.index = t
            _this.position = elementRal
            if(_this.index === 0) {
                return { 
                    ral: ral[_this.position].ral,
                    name: splitCamelCase(ral[_this.position].name), 
                    lrv: ral[_this.position].LRV,
                }
            }
        } 
    }

    return { 
        ral: ral[_this.position].ral,
        name: splitCamelCase(ral[_this.position].name), 
        lrv: ral[_this.position].LRV,
    }
}

colorConvertor.lab.rgb = function (lab) {
    const xyz = { x: 0, y:0 , z: 0 }

    xyz.y = (lab.l + 16) / 116,
    xyz.x = lab.a / 500 + xyz.y,
    xyz.z = xyz.y - lab.b / 200,

    xyz.x = 0.95047 * ((Math.pow(xyz.x,3) > 0.008856) ? Math.pow(xyz.x,3) : (xyz.x - 16/116) / 7.787)
    xyz.y = 1.00000 * ((Math.pow(xyz.y,3) > 0.008856) ? Math.pow(xyz.y,3) : (xyz.y - 16/116) / 7.787)
    xyz.z = 1.08883 * ((Math.pow(xyz.z,3) > 0.008856) ? Math.pow(xyz.z,3) : (xyz.z - 16/116) / 7.787)

    const rgb = { r: 0, g: 0, b: 0 }
    rgb.r = xyz.x *  3.2406 + xyz.y * -1.5372 + xyz.z * -0.4986
    rgb.g = xyz.x * -0.9689 + xyz.y *  1.8758 + xyz.z *  0.0415
    rgb.b = xyz.x *  0.0557 + xyz.y * -0.2040 + xyz.z *  1.0570

    for(const i of 'rgb') {
        rgb[i] = (rgb[i] > 0.0031308) ? (1.055 * Math.pow(rgb[i], 1/2.4) - 0.055) : 12.92 * rgb[i]
        rgb[i] = Math.round(Math.max(0, Math.min(1, rgb[i])) * 255)
    }

    return rgb
}

// 11 | --- Pantone -----------------------------------------------------
colorConvertor.pantone.rgb = function (pantoneInput) {
    return PullDataFromList(pantone, 'rgb', pantoneInput )
}

colorConvertor.pantone.cmyk = function (pantoneInput) {
    return PullDataFromList(pantone, 'cmyk', pantoneInput )
}

colorConvertor.pantone.lab = function (pantoneInput) {
    return PullDataFromList(pantone, 'lab', pantoneInput )
}

// 12 | --- Ral -----------------------------------------------------
colorConvertor.ral.rgb = function (ralInput) {
    return PullDataFromList(ral, 'rgb', ralInput, 'ral')
}

colorConvertor.ral.cmyk = function (ralInput) {
    return PullDataFromList(ral, 'cmyk', ralInput, 'ral')
}

colorConvertor.ral.lab = function (ralInput) {
    return PullDataFromList(ral, 'lab', ralInput, 'ral')
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
    return Object.assign(rgb, { a:1 })
}

colorConvertor.rgb.hsl = function (rgb) {
    const hsl = { h:0, s:0, l:0 }
    for(const i of 'rgb') {
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
    for(const i of 'rgb') {
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
        const d = ( rgb.r === minRGB) ? rgb.g - rgb.b : ((rgb.b === minRGB) ? rgb.r - rgb.g : rgb.b - rgb.r)
        const h = ( rgb.r === minRGB) ? 3 : (( rgb.b === minRGB) ? 1 : 5)
        hsv = {
            h: 60 * ( h - d / (maxRGB - minRGB)),
            s: (( maxRGB - minRGB ) / maxRGB ) * 100,
            v: (maxRGB) * 100
        }
    }

    return hsv
}

colorConvertor.rgb.grayscale = function (rgb) {
    if(rgb) {
        const grayscaleWhite = {
            r: 0.3,
            g: 0.59,
            b: 0.11,
        }

        for(const i of 'rgb') {
            rgb[i] = ( 255 - rgb[i] ) * grayscaleWhite[i] 
        }
        return Math.round(( rgb.r + rgb.g + rgb.b )/ 2.56)
    }
    return 100
}

colorConvertor.rgb.lab = function (rgb) {
    for(const i of 'rgb') {
        rgb[i] /= 255
    }

    rgb.r = (rgb.r > 0.04045) ? Math.pow((rgb.r + 0.055) / 1.055, 2.4) : rgb.r / 12.92
    rgb.g = (rgb.g > 0.04045) ? Math.pow((rgb.g + 0.055) / 1.055, 2.4) : rgb.g / 12.92
    rgb.b = (rgb.b > 0.04045) ? Math.pow((rgb.b + 0.055) / 1.055, 2.4) : rgb.b / 12.92

    const xyz = { x: 0, y: 0, z: 0}

    xyz.x = (rgb.r * 0.4124 + rgb.g * 0.3576 + rgb.b * 0.1805) / 0.95047
    xyz.y = (rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722) / 1.00000
    xyz.z = (rgb.r * 0.0193 + rgb.g * 0.1192 + rgb.b * 0.9505) / 1.08883

    xyz.x = (xyz.x > 0.008856) ? Math.pow(xyz.x, 1/3) : (7.787 * xyz.x) + 16/116
    xyz.y = (xyz.y > 0.008856) ? Math.pow(xyz.y, 1/3) : (7.787 * xyz.y) + 16/116
    xyz.z = (xyz.z > 0.008856) ? Math.pow(xyz.z, 1/3) : (7.787 * xyz.z) + 16/116

  return {l:((116 * xyz.y) - 16), a: (500 * (xyz.x - xyz.y)), b: (200 * (xyz.y - xyz.z))}
}

colorConvertor.rgb.cmyk = function (rgb){
    const cmyk = { c: 0, m: 0, y: 0, k: 0, }

    if (rgb.r === 0 && rgb.g === 0 && rgb.b === 0) {
        cmyk.k = 100
    } else {

        for(const i of 'rgb') {
            rgb[i] /= 255
        }

        cmyk.k = 1 - Math.max(rgb.r, rgb.g, rgb.b)

        if (cmyk.k !== 1) {
            cmyk.c = (1 - rgb.r - cmyk.k) / (1 - cmyk.k)
            cmyk.m = (1 - rgb.g - cmyk.k) / (1 - cmyk.k)
            cmyk.y = (1 - rgb.b - cmyk.k) / (1 - cmyk.k)

            for(const i of 'cmyk'){
                cmyk[i] = Math.round(cmyk[i] * 100)
            }
        }
    }
    return cmyk
}

colorConvertor.rgb.rgbdecimal = function(rgb){
    return (rgb.r << 16) + (rgb.g << 8) + (rgb.b);
}

colorConvertor.rgb.html = function(rgb){
    const _this = {
        index: 768,
        html: '',
    }

    for(const elementHtml in html){
        const t = Math.abs(html[elementHtml].rgb.r - rgb.r ) + Math.abs(html[elementHtml].rgb.g - rgb.g ) + Math.abs(html[elementHtml].rgb.b - rgb.b )
        if(t < _this.index){
            _this.index = t
            _this.html = splitCamelCase(html[elementHtml].name)
            if(_this.index === 0) {
                return _this.html
            }
        }
    }

    return _this.html
}

colorConvertor.rgb.xyz = function(rgb) {
    function pivot(n) {
        return (n > 0.04045 ? Math.pow((n + 0.055) / 1.055, 2.4) : n / 12.92) * 100.0
    }

    for(const i of 'rgb'){
        rgb[i] = pivot(rgb[i] / 255.0)
    }
       
    return {
        x: rgb.r * 0.4124 + rgb.g * 0.3576 + rgb.b * 0.1805, 
        y: rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722, 
        z: rgb.r * 0.0193 + rgb.g * 0.1192 + rgb.b * 0.9505
    }
}

colorConvertor.rgb.yuv = function(rgb) {
    const yuv = { y: 0, u: 0, v:0 }
    yuv.y = (0.257 * rgb.r) + (0.504 * rgb.g) + (0.098 * rgb.b) + 16
    yuv.u = (-0.148 * rgb.r) - (0.291 * rgb.g) + (0.439 * rgb.b) + 128
    yuv.v = (0.439 * rgb.r) - (0.368 * rgb.g) - (0.071 * rgb.b) + 128

    return yuv
}

// 14 | --- rgba -----------------------------------------------------
colorConvertor.rgba.rgb = function(rgba){
    const _this = {}

    for(const i of 'rgb'){
        _this[i] = Math.round(rgba[i] * rgba.a)
    }

    return _this
}

// 14 | --- rgbdecimal -----------------------------------------------------

colorConvertor.rgbdecimal.rgb = function (RGBdecimal) {
    return {
        r: (RGBdecimal & 0xff0000) >> 16, 
        g: (RGBdecimal & 0x00ff00) >> 8, 
        b: (RGBdecimal & 0x0000ff)
    }
}

// 15 | --- w -----------------------------------------------------
colorConvertor.w.rgb = function(w) {
    const rgb = { r: 0, g: 0, b: 0, }

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

     for(const i of 'rgb'){
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

// 16 | --- YUV -----------------------------------------------------
colorConvertor.yuv.rgb = function(yuv) {  

    return {
        r: Math.round( yuv.y + (1.140 * yuv.v) ),
        g: Math.round( yuv.y - (0.395 * yuv.v) - (0.581 * yuv.v) ),
        b: Math.round( yuv.y + (2.032 * yuv.u) )
    }
}

module.exports = colorConvertor