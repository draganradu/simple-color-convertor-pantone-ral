const ReindexColor = require('../_components/_frame_reindex')
const htmlPattern = require('../color_list/html.json')
const ralPattern = require('../color_list/ral.json')

var colorSanitizer = {}

// 1 | --- CMYK
colorSanitizer.cmyk = function (cmyk) {
    // if string convert to an Array
    if(typeof cmyk === 'string'){ 
        cmyk = ReindexColor(cmyk,'cmyk','[+-]?([0-9]*[.])?[0-9]+')
        // cmyk = cmyk.match(/[+-]?([0-9]*[.])?[0-9]+/g)  
    }

    // if Array  convert to object is
    if(Array.isArray(cmyk) && cmyk.length == 4){
        cmyk = {
            c: cmyk[0], 
            m: cmyk[1],
            y: cmyk[2], 
            k: cmyk[3]
        }
    } 
    // check if the object is ok
    if (typeof cmyk == 'object') {
        cmyk = {
            c: parseFloat(cmyk.c),
            m: parseFloat(cmyk.m),
            y: parseFloat(cmyk.y),
            k: parseFloat(cmyk.k),
        }
        
        if (cmyk.c >= 0 && cmyk.c <= 100 && cmyk.m >= 0 && cmyk.m <= 100 && cmyk.y >= 0 && cmyk.y <= 100 && cmyk.k >= 0 && cmyk.k <= 100){
            return cmyk
        }
    }
    
    return false
}

// 2 | --- grayscale
colorSanitizer.grayscale = function (grayscale) {
    if (typeof grayscale === 'string'){
        grayscale = parseInt(grayscale.replace(/[^0-9]/g,''))
    }
    
    if (typeof grayscale === 'number' && grayscale >= 0 && grayscale <= 100 ){
        return grayscale
    }
    
    return false
}

// 3 | --- hex 3
colorSanitizer.hex = function (hex) {
    return hex.replace(/[^a-f^0-9]/g,'')
}

colorSanitizer.isHex = function (hex) {
    let temp = colorSanitizer.hex(hex)
    if(temp.length === 6){
        return 6
    } else if (temp.length === 3){
        return 3
    } else {
        return false
    }
}

colorSanitizer.hex3 = function (hex) {
    if (colorSanitizer.isHex(hex) === 3){
        return hex.replace(/[^a-f^0-9]/g,'')
    } else {
        return false
    }
}

// 4 | --- hex 6
colorSanitizer.hex6 = function (hex) {
    if (colorSanitizer.isHex(hex) === 6){
        return hex.replace(/[^a-f^0-9]/g,'')
    } else {
        return false
    }
}

// 5 | --- hsl
colorSanitizer.hsl = function (hsl) {
    // if string convert to an Array
    if(typeof hsl === 'string'){ 
        hsl = ReindexColor(hsl,'hsl',new RegExp('[+-]?([0-9]*[.])?[0-9]+'))
        // hsl = hsl.match(/[+-]?([0-9]*[.])?[0-9]+/g)  
    }

    // if Array  convert to object is
    if(Array.isArray(hsl) && hsl.length == 3){
        hsl = {h: hsl[0], s: hsl[1], l: hsl[2]}
    } 
    // check if the object is ok
    if (typeof hsl == 'object') {
        hsl = {
            h: parseFloat(hsl.h),
            s: parseFloat(hsl.s),
            l: parseFloat(hsl.l),
        }
        
        if (hsl.h >= 0 && hsl.h <= 360 && hsl.s >= 0 && hsl.s <= 100 && hsl.l >= 0 && hsl.l <= 100){
            return hsl
        }
    }
    
    return false
}

// 6 | --- html
colorSanitizer.html = function (html) {
    var temp = htmlPattern.filter(a => a.name.toLowerCase() === html.toLowerCase() )
    if(temp.length > 0) {
        return temp[0].name
    }
    return false
}

// 7 | --- Lab
colorSanitizer.lab = function (lab) {
    // if string convert to an Array
    if(typeof lab === 'string'){ 
        lab = ReindexColor(lab,'lab','[+-]?([0-9]*[.])?[0-9]+')
        // lab = lab.match(/[+-]?([0-9]*[.])?[0-9]+/g)  
    }
    // if Array  convert to object is
    if(Array.isArray(lab) && lab.length == 3){
        lab = {l: lab[0], a: lab[1], b: lab[2]}
    } 
    if (typeof lab == 'object') {
        lab = {
            l: parseFloat(lab.l),
            a: parseFloat(lab.a),
            b: parseFloat(lab.b),
        }

        if (lab.l >= 0 && lab.l <= 100 && lab.a >= -128 && lab.a <= 127 && lab.b >= -128 && lab.b <= 127){
            return lab
        }
    }
    // check if the object is ok

    return false
}

// 8 | --- ral
colorSanitizer.ral = function (ral) {

    let temp = ''
    if(typeof ral === "number") {
        // pass ral as numeric value ral {3009}
        ral = {
            ral: `${ral}`
        }
    } else if (typeof ral === "string") {
        // pass ral as name value ral
        temp = ralPattern.filter( a => a.name === ral )
    } else if(typeof ral === "object" && !ral.ral && ral.name && typeof ral.name === 'string'){
        // pass ral as name value ral { ral: { name: 'oxide red', lrv: 5 }, 
        temp = ralPattern.filter( a => a.name === ral.name )
    } else  {
        // default normal value { ral: { ral: 3009, name: 'oxide red', lrv: 5 }, 
        temp = ralPattern.filter( a => a.ral === ral.ral )
    }

    return temp.length ? temp[0].ral : false
}

// 9 | --- rgb
colorSanitizer.rgb = function (rgb) {
    // if string convert to an Array
    if(typeof rgb === 'string'){ 
        rgb = ReindexColor(rgb,'rgb',/(\d+)/)
    }
    // if Array  convert to object is
    if(Array.isArray(rgb) && rgb.length == 3){
        rgb = {r: rgb[0], g: rgb[1], b: rgb[2]}
    } 
    if (typeof rgb == 'object') {
        rgb = {
            r: parseInt(rgb.r),
            g: parseInt(rgb.g),
            b: parseInt(rgb.b),
        }
        if (rgb.r >= 0 && rgb.r <= 255 && rgb.g >= 0 && rgb.g <= 255 && rgb.b >= 0 && rgb.b <= 255){
            return rgb
        }
    }
    // check if the object is ok
    return false
}


// 10 | --- w
colorSanitizer.w = function (w) {
    if (typeof w !== 'number'){
        w = parseInt(w)
    } 
    if (w >= 380 && w <= 780 ){
         return w
    } 
    return false
 }

 // 11 | --- xyz
 colorSanitizer.xyz = function (xyz) {
    return xyz
}

colorSanitizer.keys = Object.keys(colorSanitizer).filter(i => ['isHex','hex', 'isHexVerbos'].indexOf(i) === -1);

 module.exports = colorSanitizer