const ReindexColor = require('../_components/_color_reindex')
const htmlPattern = require('../color_list/html.json')
const ralPattern = require('../color_list/ral.json')
const pantonePattern = require('../color_list/pantone.json')
const AcceptedColors = require('./_accepted_colors')

var colorSanitizer = new AcceptedColors()
colorSanitizer.keys = Object.keys(colorSanitizer).filter(i => ['isHex','hex', 'isHexVerbos'].indexOf(i) === -1);

function requireProcentFix(a,b){
    if(a <= 1 && a <= 1){
        return true
    }
    return false
}
// 1 | --- CMYK
colorSanitizer.cmyk = function (cmyk) {
    // if string convert to an Array
    if(typeof cmyk === 'string'){ 
        cmyk = ReindexColor(cmyk,'cmyk','[+-]?([0-9]*[.])?[0-9]+')
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
    // if the object is ok
    if (typeof cmyk == 'object') {
        cmyk = {
            c: parseFloat(cmyk.c),
            m: parseFloat(cmyk.m),
            y: parseFloat(cmyk.y),
            k: parseFloat(cmyk.k),
        }
        // if values are in range
        if (cmyk.c >= 0 && cmyk.c <= 100 && cmyk.m >= 0 && cmyk.m <= 100 && cmyk.y >= 0 && cmyk.y <= 100 && cmyk.k >= 0 && cmyk.k <= 100){
            return cmyk
        }
    }

    return false
}

// 2 | --- grayscale
colorSanitizer.grayscale = function (grayscale) {
    
    // check if it is not a hex (o is the exception)
    if(colorSanitizer.isHex(grayscale) === false || parseInt(grayscale) === 0 ){
        // if string convert to number
        if (typeof grayscale === 'string' && colorSanitizer.isHex(grayscale) === false){
            grayscale = parseInt(grayscale.replace(/%20|[^0-9]/g,''))
        }
        // if string convert to number
        if (typeof grayscale === 'number' && grayscale >= 0 && grayscale <= 100 ){
            return grayscale
        }
    }

    return false
}

// 3 | --- hex 3
colorSanitizer.hex = function (hex) {
    if( typeof hex === 'string' && hex.length >= 3) {
    // safe guard against mislabeling hex (ex: magenta)
    if (hex.indexOf('#') === -1 || hex.indexOf('hex') === -1){
        for(let indexColor of colorSanitizer.keys){
            if (hex.indexOf(indexColor) > -1 && ['hex3', 'hex4', 'hex6', 'hex8'].indexOf(indexColor) === -1) {
                return false
            }
        }
        if(colorSanitizer.html(hex)) {
            return false
        }
    }

    hex = hex.replace(/hex3|hex4|hex6|hex8|hex|0x|ox/g,'')
    return hex.replace(/[^a-f^0-9]/g,'')
    }
    return false
}

colorSanitizer.isHex = function (hex) {
    let temp = colorSanitizer.hex(hex)
    if(temp.length === 8 || temp.length === 6 || temp.length === 4 || temp.length === 3){
        return temp.length
    } else {
        return false
    }
}

colorSanitizer.hex3 = function (hex) {
    if (colorSanitizer.isHex(hex) === 3){
        return colorSanitizer.hex(hex)
    } else {
        return false
    }
}

colorSanitizer.hex4 = function (hex) {
    if (colorSanitizer.isHex(hex) === 4){
        return colorSanitizer.hex(hex)
    } else {
        return false
    }
}

// 4 | --- hex 6
colorSanitizer.hex6 = function (hex) {
    if (colorSanitizer.isHex(hex) === 6){
        return colorSanitizer.hex(hex)
    } else {
        return false
    }
}

// 5 | --- hex 8
colorSanitizer.hex8 = function (hex) {
    if (colorSanitizer.isHex(hex) === 8){
        return colorSanitizer.hex(hex)
    } else {
        return false
    }
}

// 6 | --- hsl
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
            if(requireProcentFix(hsl.s,hsl.l)){
                hsl.s *= 100 
                hsl.l *= 100 
            }
            return hsl
        }
    }
    
    return false
}

colorSanitizer.hsv = function (hsv) {
    if (hsv.indexOf('ral') > -1) { return false }
    // if string convert to an Array
    if(typeof hsv === 'string'){ 
        hsv = ReindexColor(hsv,'hsv',new RegExp('[+-]?([0-9]*[.])?[0-9]+'))
    }

    // if Array  convert to object is
    if(Array.isArray(hsv) && hsv.length == 3){
        hsv = {h: hsv[0], s: hsv[1], v: hsv[2]}
    } 
    // check if the object is ok
    if (typeof hsv == 'object') {
        hsv = {
            h: parseFloat(hsv.h),
            s: parseFloat(hsv.s),
            v: parseFloat(hsv.v),
        }
        
        if (hsv.h >= 0 && hsv.h <= 360 && hsv.s >= 0 && hsv.s <= 100 && hsv.v >= 0 && hsv.v <= 100){
            if (requireProcentFix(hsv.s, hsv.v)) {
                hsv.s *= 100
                hsv.v *= 100
            }
            return hsv
        }
    }
    
    return false
}

colorSanitizer.pantone = function (pantone) {
    function truePantone (pantone) {
        pantone = pantone.toLowerCase()
        const p_tempNumeric = Number(pantone.replace(/[^0-9]/g,''))
        const p_isIndex = (pantone.indexOf('c') > -1 || pantone.indexOf('pantone') > -1)
        const p_isNumeric = p_tempNumeric >= 100 && p_tempNumeric <= 5875;
        return (p_isNumeric && p_isIndex)? `${p_tempNumeric}C` : false
    }

    // Check if variable is a numberic valid pantone
    let tempPantoneNumber = ''
    if(typeof pantone === "number") {
        return false
    } else if (typeof pantone === "string") {
        tempPantoneNumber = truePantone(pantone)
    } else if(typeof pantone === "object" && pantone.name && typeof pantone.name === 'string'){
        tempPantoneNumber = truePantone(pantone.name)
    } 

    // Check if variable is a valid pantone list color
    if (tempPantoneNumber) {
        const tempPantoneArray = pantonePattern.filter(a => a.name === tempPantoneNumber)
        if (tempPantoneArray.length === 1) {
            return tempPantoneArray[0].name
        }
    }
    return false
}

// 7 | --- html
colorSanitizer.html = function (html) {
    html = html.toLowerCase().replace(/html|[^a-z]/g,'')
    if(html.length >= 3){
        var temp = htmlPattern.filter(a => a.name.toLowerCase() === html )
        if(temp.length > 0) {
            return temp[0].name
        }
    }
    return false
}

// 8 | --- Lab
colorSanitizer.lab = function (lab) {
    // if string convert to an Array
    if(typeof lab === 'string' && lab.length >= 5){ 
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

// 9 | --- ral
colorSanitizer.ral = function (ral) {
    function isRalNumeric (ral) { return (ral >= 1000 && ral <= 9023 ) }
    function isRalName (ral) { 
        ral.replace(/ral|[^a-z]/g,'')
        if (ral.length >= 4) { return true }
        return false
    }
    let temp = ''
    if(typeof ral === "number") {
        // pass ral as numeric value ral {3009}
        ral = {
            ral: `${ral}`
        }
    } else if (typeof ral === "string" && ral.indexOf('ral') > -1) {
        let ralFilterName = ral.replace(/ral|[^a-z]/g,'')
        let ralFilterNumber = parseInt(ral.replace(/[^0-9]/g,''))

        temp = ralPattern.filter( a => a.name.toLowerCase() === ralFilterName || a.ral === ralFilterNumber)
    } else if(typeof ral === "object" && !ral.ral && ral.name && typeof ral.name === 'string'){
        // pass ral as name value ral { ral: { name: 'oxide red', lrv: 5 }, 
        ral.name = ral.replace(/[^a-z]/g,'')
        temp = ralPattern.filter( a => a.name === ral.name )
    } else  {
        // default normal value { ral: { ral: 3009, name: 'oxide red', lrv: 5 }, 
        temp = ralPattern.filter( a => a.ral === ral.ral )
    }

    return temp.length ? temp[0].ral : false
}

// 10 | --- rgb
colorSanitizer.rgb = function (rgb) {
    // if string convert to an Array
    if(typeof rgb === 'string'){ 
        if(rgb.length < 5){ return false}
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

// 10 | --- rgba 
colorSanitizer.rgba = function (rgba) {
    
    // if string convert to an Array
    if(typeof rgba === 'string'){ 
        rgba = ReindexColor(rgba,'rgba','[+-]?([0-9]*[.])?[0-9]+')
    }
    // if Array  convert to object is
    if(Array.isArray(rgba) && rgba.length == 4){
        rgba = {r: rgba[0], g: rgba[1], b: rgba[2], a:rgba[3]}
    } 
    if (typeof rgba == 'object') {
        rgba = {
            r: parseInt(rgba.r),
            g: parseInt(rgba.g),
            b: parseInt(rgba.b),
            a: parseFloat(rgba.a)
        }
        if (rgba.r >= 0 && rgba.r <= 255 && rgba.g >= 0 && rgba.g <= 255 && rgba.b >= 0 && rgba.b <= 255 && rgba.a >=0 && rgba.a <= 1){
            return rgba
        }
    }
    // check if the object is ok
    return false
}

// 11 | --- w
colorSanitizer.w = function (w) {

    if (typeof w === 'string' && w.indexOf(w) > -1 ){
        w = parseInt(w.replace(/[^0-9]/,''))
    } 
    if (typeof w === 'number' && w >= 380 && w <= 780 ){
         return w
    } 
    return false
 }

 // 12 | --- xyz
 colorSanitizer.xyz = function (xyz) {
    if(typeof xyz === 'string'){ 
        xyz = ReindexColor(xyz,'xyz','[+-]?([0-9]*[.])?[0-9]+')
        
    }
    if(Array.isArray(xyz) && xyz.length == 3){
        xyz = {x: xyz[0], y: xyz[1], z: xyz[2]}
    } 
    if (typeof xyz == 'object') {
        if(xyz.x && xyz.y && xyz.z ){
            xyz.x = parseFloat(xyz.x) 
            xyz.y = parseFloat(xyz.y) 
            xyz.z = parseFloat(xyz.z) 
        }
        return xyz
    }
    return false
}

 module.exports = colorSanitizer