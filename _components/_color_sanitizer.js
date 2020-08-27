'use strict'

const { html, pantone, ral } = require('color_library')
const _safeguard = require('./_color_safeguard')
const AcceptedColors = require('./_accepted_colors')
const ReindexColor = require('../_components/_color_reindex')
const procent = require('../_components/frame/_frame_procent_fix')


var colorSanitizer = new AcceptedColors()

function arrayToObject(data, keys){
    if(data.length === keys.length){
        const temp = {}
        for(const i in keys) {
            temp[keys[i]] = data[i]
        }
        return temp
    }
    return false
}

function makeInt(inputNumber){
    const temp = parseInt(inputNumber)
    return isNaN(temp) ? 0 : temp
}

function makeFloat(inputNumber){
    const temp = parseFloat(inputNumber)
    return isNaN(temp) ? 0 : temp
}

function abstractMakeInt(a,b = 100){
    if(typeof a === 'string') {
        if( a.indexOf('%') > -1 ){
            return (parseFloat(a)/100) * b
          }
          if (parseFloat(a) < 1) {
            return parseFloat(a) * b 
          }
          return parseFloat(a)
    }
    
    return isNaN(a) ? false : a
}

function getNumbers (number) {
    return makeInt(number.replace(/[^0-9]/g,'')) 
}

// 1 | --- CMYK -----------------------------------------------------
colorSanitizer.cmyk = function (cmyk) {
    if(_safeguard(cmyk,'cmyk')){ 
        cmyk = ReindexColor(cmyk,'cmyk', '[+-]?([0-9]*[.])?[0-9]+')
    }
    if(Array.isArray(cmyk)){
        cmyk = arrayToObject(cmyk,'cmyk')
    } 
    if (typeof cmyk === 'object') {
        for(const i of 'cmyk') {
            cmyk[i] = abstractMakeInt(cmyk[i])
            // validate on conversion
            if(isNaN(cmyk[i]) || cmyk[i] < 0 || cmyk[i] > 100 ){
                return false
            }
        }
        return cmyk
    }

    return false
}

// 2 | --- Grayscale -----------------------------------------------------
colorSanitizer.grayscale = function (grayscale) {
    // check if it is not a hex (o is the exception)
    if(!colorSanitizer.isHex(grayscale)){
        // if string convert to number
        if (typeof grayscale === 'string' && grayscale.indexOf('rgb') === -1){
            grayscale = makeInt(grayscale.replace(/%20|[^0-9]/g,''))
        }
        // if string convert to number
        if (typeof grayscale === 'number' && grayscale >= 0 && grayscale <= 100 ){
            return (grayscale >= 0 && grayscale <= 100)? grayscale : true
        }
    }
    return false
}

// 3 | --- hex 3
colorSanitizer.hex = function (hex) {
    if(_safeguard(hex,'hex')) {
    // safe guard against mislabeling hex (ex: magenta)
    if (hex.indexOf('#') < 0 || hex.indexOf('hex') < 0){
        for(const indexColor of colorSanitizer.sanitaryKeys){
            if (hex.indexOf(indexColor) > -1 && ['hex3', 'hex4', 'hex6', 'hex8'].indexOf(indexColor) < 0) {
                return false
            }
        }
        if(colorSanitizer.html(hex)) {
            return false
        }
    }
    
    hex = hex.replace(/android|hex3|hex4|hex6|hex8|hex|0x|ox|[^a-f^0-9]/g,'')
    return (hex.length === 8 || hex.length === 6 || hex.length === 4 || hex.length === 3) ? hex : false
    }
    return false
}

colorSanitizer.isHex = function (hex) {
    const temp = colorSanitizer.hex(hex)
    return (temp) ? temp.length : false
}
// ------------- needs work
// ------------- return Array [HexSanitizedlength, sanitizedHex]


// 3 | --- Hex 3 ---------------------------------------------------------

colorSanitizer.hex3 = function (hex) {
    const temp = colorSanitizer.hex(hex)
    return (temp.length === 3) ? temp : false
}

// 4 | --- Hex 4 -----------------------------------------------------
colorSanitizer.hex4 = function (hex) {
    const temp = colorSanitizer.hex(hex)
    return (temp.length === 4) ? temp : false
}

// 5 | --- Hex 6 -----------------------------------------------------
colorSanitizer.hex6 = function (hex) {
    const temp = colorSanitizer.hex(hex)
    return (temp.length === 6) ? temp : false
}

// 6 | --- hex 8 -----------------------------------------------------
colorSanitizer.hex8 = function (hex) {
    const temp = colorSanitizer.hex(hex)
    return (temp.length === 8) ? temp : false
}

// 7 | --- html  -----------------------------------------------------
colorSanitizer.html = function (htmlInput) {
    if (_safeguard(htmlInput,'html')){
        htmlInput = htmlInput.toLowerCase().replace(/html|[^a-z]/g,'')
        var temp = html.filter(a => a.name.toLowerCase() === htmlInput )
        return (temp.length > 0)? temp[0].name : false
    }
    return false
}
// ------------- needs work
// ------------- need some arlgortam to exclude mode then >= 3

// 8 | --- hsl -----------------------------------------------------
colorSanitizer.hsl = function (hsl) {
    if(_safeguard(hsl,'hsl')){ 
        hsl = ReindexColor(hsl,'hsl',new RegExp('([0-9]*[.])?[0-9]+'))
    }
    if(Array.isArray(hsl)){
        hsl = arrayToObject(hsl, 'hsl')
    } 
    if (typeof hsl === 'object') {
        for(const i of 'hsl') {
            hsl[i] = makeFloat(hsl[i])
        }
        
        if (hsl.h >= 0 && hsl.h <= 360 && hsl.s >= 0 && hsl.s <= 100 && hsl.l >= 0 && hsl.l <= 100){
            if(procent.require(hsl.s,hsl.l)){
                hsl.s *= 100 
                hsl.l *= 100 
            }
            return hsl
        }
    }
    
    return false
}

// 9 | --- hsv -----------------------------------------------------
colorSanitizer.hsv = function (hsv) {
    if(_safeguard(hsv,'hsv')){ 
        hsv = ReindexColor(hsv,'hsv',new RegExp('[+-]?([0-9]*[.])?[0-9]+'))
    }
    if(Array.isArray(hsv)){
        hsv = arrayToObject(hsv, 'hsv')
    } 
    if (typeof hsv === 'object') {
        for(const i of 'hsv') {
            hsv[i] = makeFloat(hsv[i])
        }
        
        if (hsv.h >= 0 && hsv.h <= 360 && hsv.s >= 0 && hsv.s <= 100 && hsv.v >= 0 && hsv.v <= 100){
            if (procent.require(hsv.s, hsv.v)) {
                hsv.s *= 100
                hsv.v *= 100
            }
            return hsv
        }
    }
    return false
}

// 10 | --- Lab -----------------------------------------------------
colorSanitizer.lab = function (lab) {
    if(_safeguard(lab,'lab')){ 
        lab = ReindexColor(lab,'lab', '[+-]?([0-9]*[.])?[0-9]+')
    }
    if(Array.isArray(lab)){
        lab = arrayToObject(lab, 'lab')
    } 
    if (typeof lab === 'object') {
        for(const i of 'lab') {
            lab[i] = parseFloat(lab[i])
        }

        if (lab.l >= 0 && lab.l <= 100 && lab.a >= -128 && lab.a <= 127 && lab.b >= -128 && lab.b <= 127){
            return lab
        }
    }
    return false
}

// 11 | --- Pantone -----------------------------------------------------
colorSanitizer.pantone = function (pantoneInput) {
    function truePantone (pantoneInput) {
        pantoneInput = pantoneInput.toLowerCase()
        const p_tempNumeric = Number(pantoneInput.replace(/[^0-9]/g,''))
        const p_isIndex = (pantoneInput.indexOf('c') > -1 || pantoneInput.indexOf('pantone') > -1)
        const p_isNumeric = p_tempNumeric >= 100 && p_tempNumeric <= 5875;
        return (p_isNumeric && p_isIndex)? `${p_tempNumeric}C` : false
    }

    // Check if variable is a numberic valid pantone
    let tempPantoneNumber = ''
    if(typeof pantoneInput === 'number') { 
        return false // because it would interfere with hex
    } else if (typeof pantoneInput === 'string' && pantoneInput.length >= 3 && _safeguard(pantoneInput,'pantone')) {
        tempPantoneNumber = truePantone(pantoneInput)
    } else if(typeof pantoneInput === 'object' && pantoneInput.name && typeof pantoneInput.name === 'string' && pantoneInput.length >= 3){
        tempPantoneNumber = truePantone(pantoneInput.name)
    } 

    // Check if variable is a valid pantone list color
    if (tempPantoneNumber) {
        const tempPantoneArray = pantone.filter(a => a.name === tempPantoneNumber)
        return (tempPantoneArray.length === 1)?tempPantoneArray[0].name : false
    }
    return false
}

// 12 | --- Ral -----------------------------------------------------
colorSanitizer.ral = function (ralInput) {
    function isRalNumeric (ralInput) { return (ralInput >= 1000 && ralInput <= 9023 )? ralInput : false }
    function isRalName (ralInput) { 
        ralInput = ralInput.replace(/ral|[^a-z]/g,'')
        if (ralInput.length >= 4) { return ralInput }
        return false
    }
    let temp = ''
    if(typeof ralInput === 'number' && isRalNumeric(ralInput)) {
        // pass ral as numeric value ral {3009}
        ralInput = {
            ral: `${ralInput}`
        }
    } else if (typeof ralInput === 'string' && ralInput.indexOf('ral') > -1) {
        const ralFilterName = isRalName(ralInput)
        const ralFilterNumber = isRalNumeric(makeInt(ralInput.replace(/[^0-9]/g,'')))

        temp = (ralFilterName || ralFilterNumber ) ? ral.filter( a => a.name.toLowerCase() === ralFilterName || a.ral === ralFilterNumber) : false

    } else if(typeof ralInput === 'object' && !ralInput.ral && ralInput.name && typeof ralInput.name === 'string'){
        // pass ral as name value ral { ral: { name: 'oxide red', lrv: 5 }, 
        ralInput.name = isRalName(ralInput.name)
        temp = (ralInput.name) ? ral.filter( a => a.name === ralInput.name ) : false
    } else  {
        // default normal value { ral: { ral: 3009, name: 'oxide red', lrv: 5 }, 
        temp = ral.filter( a => a.ral === ralInput.ral )
    }

    return temp.length ? temp[0].ral : false
}

// 13 | --- rgb -----------------------------------------------------
colorSanitizer.rgb = function (rgb) {
    if(_safeguard(rgb,'rgb')){ 
        // rgb = ReindexColor(rgb,'rgb',/(\d+)/)
        rgb = ReindexColor(rgb,'rgb',/([0-9]*[.])?[0-9]?[0-9%]+/, true)
    }
    // if Array  convert to object is
    if(Array.isArray(rgb)){
        rgb = arrayToObject(rgb, 'rgb')
    } 
    if (typeof rgb === 'object') {
        for(const i of 'rgb') {
            rgb[i] = abstractMakeInt(rgb[i], 255)
            if(isNaN(rgb[i]) || rgb[i] < 0 || rgb[i] > 255 ){
                return false
            }
        }
        return rgb
    }
    // check if the object is ok
    return false
}

// 14 | --- rgba -----------------------------------------------------
colorSanitizer.rgba = function (rgba) {
    if(_safeguard(rgba,'rgba')){ 
        rgba = ReindexColor(rgba,'rgba', '([0-9]*[.])?[0-9]+')
    }
    if(Array.isArray(rgba)){
        rgba = arrayToObject(rgba, 'rgba')
    } 
    if (typeof rgba === 'object') {
        for(const i of 'rgb') {
            rgba[i] = makeInt(rgba[i])
            if(rgba[i] < 0 || rgba[i] > 255 ){
                return false
            }
        }

        rgba.a = parseFloat(rgba.a)
        return (rgba.a >= 0 && rgba.a <= 1)? rgba : false
    }
    return false
}

// 15 | --- rgbdecimal -----------------------------------------------------
colorSanitizer.rgbdecimal = function (rgb) {
    if (typeof rgb === 'string') {
        const numericData =  rgb.match(/(\d+)/g)
        if(rgb.indexOf('rgb') > -1 || rgb.indexOf('decimal') > -1) {
            return (numericData && numericData.length === 1) ? numericData : false
        } else {
            if(numericData && numericData.length === 1) {
                return makeInt(numericData[0]) > 65792 ? numericData : false
            }
        }
    }

    return false
}

// 16 | --- w -----------------------------------------------------
colorSanitizer.w = function (w) {
    
    if (typeof w === 'string' && w.indexOf(w) > -1 ){
        w = makeInt(w.replace(/[^0-9]/,''))
    } 
    if (typeof w === 'number'){
         return (w >= 380 && w <= 780)? w : false
    } 
    return false
 }

// 17 | --- XYZ -----------------------------------------------------
 colorSanitizer.xyz = function (xyz) {
    if(_safeguard(xyz,'xyz')){ 
        xyz = ReindexColor(xyz,'xyz', '[+-]?([0-9]*[.])?[0-9]+')
    }
    if(Array.isArray(xyz)){
        xyz = arrayToObject(xyz, 'xyz')
    } 
    if (typeof xyz === 'object') {
        for(const i of 'xyz') {
            xyz[i] = makeInt(xyz[i])
            if(xyz[i] <= 0){
                return false
            }
        }
        return xyz
    }
    return false
}

// 18 | --- YUV -----------------------------------------------------
colorSanitizer.yuv = function (yuv) {
    if(_safeguard(yuv,'yuv')){ 
        yuv = ReindexColor(yuv,'yuv', '[+-]?([0-9]*[.])?[0-9]+')
    }
    if(Array.isArray(yuv)){
        yuv = arrayToObject(yuv, 'yuv')
    } 
    if (typeof yuv === 'object') {
        for(const i of 'yuv') {
            yuv[i] = makeInt(yuv[i])
            if(i !== 'u' && yuv[i] < 0){
                return false
            }
        }
        return yuv
    }
    return false
}

 module.exports = colorSanitizer