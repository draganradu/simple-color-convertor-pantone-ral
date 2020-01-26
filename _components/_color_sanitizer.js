const ReindexColor = require('../_components/_color_reindex')
const htmlPattern = require('../color_list/html.json')
const ralPattern = require('../color_list/ral.json')
const pantonePattern = require('../color_list/pantone.json')
const AcceptedColors = require('./_accepted_colors')
const _safeguard = require('./_color_safeguard')

var colorSanitizer = new AcceptedColors()
colorSanitizer.keys = Object.keys(colorSanitizer).filter(i => ['isHex', 'hex', 'isHexVerbos'].indexOf(i) < 0);

function requireProcentFix(a,b){
    if(a <= 1 && a <= 1){
        return true
    }
    return false
}

function arrayToObject(data, keys){
    if(data.length === keys.length){
        let temp = {}
        for(let i in keys) {
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

// 1 | --- CMYK -----------------------------------------------------
colorSanitizer.cmyk = function (cmyk) {
    if(typeof cmyk === 'string' && _safeguard(cmyk,'cmyk', colorSanitizer.keys)){ 
        cmyk = ReindexColor(cmyk,'cmyk', '[+-]?([0-9]*[.])?[0-9]+')
    }
    if(Array.isArray(cmyk)){
        cmyk = arrayToObject(cmyk,'cmyk')
    } 
    if (typeof cmyk === 'object') {
        for(let i of 'cmyk') {
            cmyk[i] = makeFloat(cmyk[i])
            // validate on conversion
            if(cmyk[i] < 0 || cmyk[i] > 100 ){
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
        if (typeof grayscale === 'string'){
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
    if( typeof hex === 'string' && _safeguard(hex,'hex',colorSanitizer.keys)) {
    // safe guard against mislabeling hex (ex: magenta)
    if (hex.indexOf('#') < 0 || hex.indexOf('hex') < 0){
        for(let indexColor of colorSanitizer.keys){
            if (hex.indexOf(indexColor) > -1 && ['hex3', 'hex4', 'hex6', 'hex8'].indexOf(indexColor) < 0) {
                return false
            }
        }
        if(colorSanitizer.html(hex)) {
            return false
        }
    }

    hex = hex.replace(/hex3|hex4|hex6|hex8|hex|0x|ox|[^a-f^0-9]/g,'')
    return (hex.length === 8 || hex.length === 6 || hex.length === 4 || hex.length === 3) ? hex : false
    }
    return false
}

colorSanitizer.isHex = function (hex) {
    let temp = colorSanitizer.hex(hex)
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
colorSanitizer.html = function (html) {
    if (_safeguard(html,'html',colorSanitizer.keys)){
        html = html.toLowerCase().replace(/html|[^a-z]/g,'')
        var temp = htmlPattern.filter(a => a.name.toLowerCase() === html )
        return (temp.length > 0)? temp[0].name : false
    }
    return false
}
// ------------- needs work
// ------------- need some arlgortam to exclude mode then >= 3

// 8 | --- hsl -----------------------------------------------------
colorSanitizer.hsl = function (hsl) {
    if(typeof hsl === 'string' && _safeguard(hsl,'hsl',colorSanitizer.keys)){ 
        hsl = ReindexColor(hsl,'hsl',new RegExp('([0-9]*[.])?[0-9]+'))
    }
    if(Array.isArray(hsl)){
        hsl = arrayToObject(hsl, 'hsl')
    } 
    if (typeof hsl === 'object') {
        for(let i of 'hsl') {
            hsl[i] = makeFloat(hsl[i])
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

// 9 | --- hsv -----------------------------------------------------
colorSanitizer.hsv = function (hsv) {
    if(typeof hsv === 'string' && _safeguard(hsv,'hsv',colorSanitizer.keys)){ 
        hsv = ReindexColor(hsv,'hsv',new RegExp('[+-]?([0-9]*[.])?[0-9]+'))
    }
    if(Array.isArray(hsv)){
        hsv = arrayToObject(hsv, 'hsv')
    } 
    if (typeof hsv === 'object') {
        for(let i of 'hsv') {
            hsv[i] = makeFloat(hsv[i])
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

// 10 | --- Lab -----------------------------------------------------
colorSanitizer.lab = function (lab) {
    if(typeof lab === 'string' && _safeguard(lab,'lab', colorSanitizer.keys)){ 
        lab = ReindexColor(lab,'lab', '[+-]?([0-9]*[.])?[0-9]+')
    }
    if(Array.isArray(lab)){
        lab = arrayToObject(lab, 'lab')
    } 
    if (typeof lab === 'object') {
        for(let i of 'lab') {
            lab[i] = parseFloat(lab[i])
        }

        if (lab.l >= 0 && lab.l <= 100 && lab.a >= -128 && lab.a <= 127 && lab.b >= -128 && lab.b <= 127){
            return lab
        }
    }
    return false
}

// 11 | --- Pantone -----------------------------------------------------
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
    if(typeof pantone === 'number') { 
        return false // because it would interfere with hex
    } else if (typeof pantone === 'string' && pantone.length >= 3 && _safeguard(pantone,'pantone',colorSanitizer.keys)) {
        tempPantoneNumber = truePantone(pantone)
    } else if(typeof pantone === 'object' && pantone.name && typeof pantone.name === 'string' && pantone.length >= 3){
        tempPantoneNumber = truePantone(pantone.name)
    } 

    // Check if variable is a valid pantone list color
    if (tempPantoneNumber) {
        const tempPantoneArray = pantonePattern.filter(a => a.name === tempPantoneNumber)
        return (tempPantoneArray.length === 1)?tempPantoneArray[0].name : false
    }
    return false
}

// 12 | --- Ral -----------------------------------------------------
colorSanitizer.ral = function (ral) {
    function isRalNumeric (ral) { return (ral >= 1000 && ral <= 9023 )? ral : false }
    function isRalName (ral) { 
        ral = ral.replace(/ral|[^a-z]/g,'')
        if (ral.length >= 4) { return ral }
        return false
    }
    let temp = ''
    if(typeof ral === 'number' && isRalNumeric(ral)) {
        // pass ral as numeric value ral {3009}
        ral = {
            ral: `${ral}`
        }
    } else if (typeof ral === 'string' && ral.indexOf('ral') > -1) {
        let ralFilterName = isRalName(ral)
        let ralFilterNumber = isRalNumeric(makeInt(ral.replace(/[^0-9]/g,'')))

        temp = (ralFilterName || ralFilterNumber ) ? ralPattern.filter( a => a.name.toLowerCase() === ralFilterName || a.ral === ralFilterNumber) : false

    } else if(typeof ral === 'object' && !ral.ral && ral.name && typeof ral.name === 'string'){
        // pass ral as name value ral { ral: { name: 'oxide red', lrv: 5 }, 
        ral.name = isRalName(ral.name)
        temp = (ral.name) ? ralPattern.filter( a => a.name === ral.name ) : false
    } else  {
        // default normal value { ral: { ral: 3009, name: 'oxide red', lrv: 5 }, 
        temp = ralPattern.filter( a => a.ral === ral.ral )
    }

    return temp.length ? temp[0].ral : false
}

// 13 | --- rgb -----------------------------------------------------
colorSanitizer.rgb = function (rgb) {
    if(typeof rgb === 'string' && _safeguard(rgb,'rgb',colorSanitizer.keys)){ 
        rgb = ReindexColor(rgb,'rgb',/(\d+)/)
    }
    // if Array  convert to object is
    if(Array.isArray(rgb)){
        rgb = arrayToObject(rgb, 'rgb')
    } 
    if (typeof rgb === 'object') {
        for(let i of 'rgb') {
            rgb[i] = makeInt(rgb[i])
            if(rgb[i] < 0 || rgb[i] > 255 ){
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
    if(typeof rgba === 'string' && _safeguard(rgba,'rgba',colorSanitizer.keys)){ 
        rgba = ReindexColor(rgba,'rgba', '([0-9]*[.])?[0-9]+')
    }
    if(Array.isArray(rgba)){
        rgba = arrayToObject(rgba, 'rgba')
    } 
    if (typeof rgba === 'object') {
        for(let i of 'rgb') {
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

// 15 | --- w -----------------------------------------------------
colorSanitizer.w = function (w) {
    if (typeof w === 'string' && w.indexOf(w) > -1 ){
        w = makeInt(w.replace(/[^0-9]/,''))
    } 
    if (typeof w === 'number'){
         return (w >= 380 && w <= 780)? w : false
    } 
    return false
 }

// 16 | --- XYZ -----------------------------------------------------
 colorSanitizer.xyz = function (xyz) {
    if(typeof xyz === 'string' && _safeguard(xyz,'xyz',colorSanitizer.keys)){ 
        xyz = ReindexColor(xyz,'xyz', '[+-]?([0-9]*[.])?[0-9]+')
    }
    if(Array.isArray(xyz)){
        xyz = arrayToObject(xyz, 'xyz')
    } 
    if (typeof xyz === 'object') {
        for(let i of 'xyz') {
            xyz[i] = makeInt(xyz[i])
            if(xyz[i] <= 0){
                return false
            }
        }
        return xyz
    }
    return false
}

 module.exports = colorSanitizer