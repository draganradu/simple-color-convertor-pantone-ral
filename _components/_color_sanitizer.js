const { html, pantone, ral } = require('color_library')
const _safeguard = require('./_color_safeguard')
const AcceptedColors = require('./_accepted_colors')
const ReindexColor = require('./_color_reindex')
const procent = require('./frame/_frame_procent_fix')

const colorSanitizer = new AcceptedColors()

function arrayToObject(data, keys) {
    if (data.length === keys.length) {
        const temp = {}
        for (const i in keys) {
            if (Object.prototype.hasOwnProperty.call(keys, i)) {
                temp[keys[i]] = data[i]
            }
        }
        return temp
    }
    return false
}

function makeInt(inputNumber) {
    const temp = parseInt(inputNumber, 10)
    return Number.isNaN(temp) ? 0 : temp
}

function makeFloat(inputNumber) {
    const temp = parseFloat(inputNumber)
    return Number.isNaN(temp) ? 0 : temp
}

function abstractMakeInt(a, b = 100) {
    if (typeof a === 'string') {
        if (a.indexOf('%') > -1) {
            return (parseFloat(a) / 100) * b
        }
        if (parseFloat(a) < 1) {
            return parseFloat(a) * b
        }
        return parseFloat(a)
    }

    return Number.isNaN(a) ? false : a
}

// 1 | --- CMYK -----------------------------------------------------
colorSanitizer.cmyk = function helperCMYK(cmyk) {
    let _cmyk = cmyk
    if (_safeguard(_cmyk, 'cmyk')) {
        _cmyk = ReindexColor(_cmyk, 'cmyk', '[+-]?([0-9]*[.])?[0-9]+')
    }
    if (Array.isArray(_cmyk)) {
        _cmyk = arrayToObject(_cmyk, 'cmyk')
    }
    if (typeof _cmyk === 'object') {
        for (const i of 'cmyk') {
            _cmyk[i] = abstractMakeInt(_cmyk[i])
            // validate on conversion
            if (Number.isNaN(_cmyk[i]) || _cmyk[i] < 0 || _cmyk[i] > 100) {
                return false
            }
        }
        return _cmyk
    }
    return false
}

// 2 | --- Grayscale -----------------------------------------------------
colorSanitizer.grayscale = function helperGrayscale(grayscale) {
    let _grayscale = grayscale
    // check if it is not a hex (o is the exception)
    if (!colorSanitizer.isHex(_grayscale)) {
        // if string convert to number
        if (typeof _grayscale === 'string' && _grayscale.indexOf('rgb') === -1) {
            _grayscale = makeInt(_grayscale.replace(/%20|[^0-9]/g, ''))
        }
        // if string convert to number
        if (typeof _grayscale === 'number' && _grayscale >= 0 && _grayscale <= 100) {
            return (_grayscale >= 0 && _grayscale <= 100) ? _grayscale : true
        }
    }
    return false
}

// 3 | --- hex 3
colorSanitizer.hex = function helperHex(hex) {
    if (_safeguard(hex, 'hex')) {
    // safe guard against mislabeling hex (ex: magenta)
        if (hex.indexOf('#') < 0 || hex.indexOf('hex') < 0) {
            for (const indexColor of colorSanitizer.sanitaryKeys) {
                if (hex.indexOf(indexColor) > -1 && ['hex3', 'hex4', 'hex6', 'hex8'].indexOf(indexColor) < 0) {
                    return false
                }
            }
            if (colorSanitizer.html(hex)) {
                return false
            }
        }

        const _hex = hex.replace(/android|hex3|hex4|hex6|hex8|hex|0x|ox|[^a-f^0-9]/g, '')
        return (_hex.length === 8 || _hex.length === 6 || _hex.length === 4 || _hex.length === 3) ? _hex : false
    }
    return false
}

colorSanitizer.isHex = function helperIsHex(hex) {
    const temp = colorSanitizer.hex(hex)
    return (temp) ? temp.length : false
}
// ------------- needs work
// ------------- return Array [HexSanitizedlength, sanitizedHex]

// 3 | --- Hex 3 ---------------------------------------------------------

colorSanitizer.hex3 = function sanitizeHex3(hex) {
    const temp = colorSanitizer.hex(hex)
    return (temp.length === 3) ? temp : false
}

// 4 | --- Hex 4 -----------------------------------------------------
colorSanitizer.hex4 = function sanitizeHex4(hex) {
    const temp = colorSanitizer.hex(hex)
    return (temp.length === 4) ? temp : false
}

// 5 | --- Hex 6 -----------------------------------------------------
colorSanitizer.hex6 = function sanitizeHex6(hex) {
    const temp = colorSanitizer.hex(hex)
    return (temp.length === 6) ? temp : false
}

// 6 | --- hex 8 -----------------------------------------------------
colorSanitizer.hex8 = function sanitizeHex8(hex) {
    const temp = colorSanitizer.hex(hex)
    return (temp.length === 8) ? temp : false
}

// 7 | --- html  -----------------------------------------------------
colorSanitizer.html = function sanitizeHtml(htmlInput) {
    if (_safeguard(htmlInput, 'html')) {
        const _htmlInput = htmlInput.toLowerCase().replace(/html|[^a-z]/g, '')
        const temp = html.filter((a) => a.name.toLowerCase() === _htmlInput)
        return (temp.length > 0) ? temp[0].name : false
    }
    return false
}
// ------------- needs work
// ------------- need some arlgortam to exclude mode then >= 3

// 8 | --- hsl -----------------------------------------------------
colorSanitizer.hsl = function sanitizeHSL(hsl) {
    let _hsl = hsl
    if (_safeguard(_hsl, 'hsl')) {
        _hsl = ReindexColor(_hsl, 'hsl', new RegExp('([0-9]*[.])?[0-9]+'))
    }
    if (Array.isArray(_hsl)) {
        _hsl = arrayToObject(_hsl, 'hsl')
    }
    if (typeof _hsl === 'object') {
        for (const i of 'hsl') {
            _hsl[i] = makeFloat(_hsl[i])
        }
        const { h, s, l } = _hsl
        if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
            if (procent.require(s, l)) {
                _hsl.s *= 100
                _hsl.l *= 100
            }
            return _hsl
        }
    }

    return false
}

// 9 | --- hsv -----------------------------------------------------
colorSanitizer.hsv = function sanitizeHSV(hsv) {
    let _hsv = hsv
    if (_safeguard(_hsv, 'hsv')) {
        _hsv = ReindexColor(_hsv, 'hsv', new RegExp('[+-]?([0-9]*[.])?[0-9]+'))
    }
    if (Array.isArray(_hsv)) {
        _hsv = arrayToObject(_hsv, 'hsv')
    }
    if (typeof _hsv === 'object') {
        for (const i of 'hsv') {
            _hsv[i] = makeFloat(_hsv[i])
        }
        const { h, s, v } = _hsv
        if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && v >= 0 && v <= 100) {
            if (procent.require(s, v)) {
                _hsv.s *= 100
                _hsv.v *= 100
            }
            return _hsv
        }
    }
    return false
}

// 10 | --- Lab -----------------------------------------------------
colorSanitizer.lab = function sanitizeLAB(lab) {
    let _lab = lab
    if (_safeguard(_lab, 'lab')) {
        _lab = ReindexColor(_lab, 'lab', '[+-]?([0-9]*[.])?[0-9]+')
    }
    if (Array.isArray(_lab)) {
        _lab = arrayToObject(_lab, 'lab')
    }
    if (typeof _lab === 'object') {
        for (const i of 'lab') {
            _lab[i] = parseFloat(_lab[i])
        }

        const { l, a, b } = _lab
        if (l >= 0 && l <= 100 && a >= -128 && a <= 127 && b >= -128 && b <= 127) {
            return _lab
        }
    }
    return false
}

// 11 | --- Pantone -----------------------------------------------------
colorSanitizer.pantone = function sanitizePantone(pantoneInput) {
    function truePantone(panton) {
        const _pantone = panton.toLowerCase()
        const pTempNumeric = Number(_pantone.replace(/[^0-9]/g, ''))
        const pIsIndex = (_pantone.indexOf('c') > -1 || _pantone.indexOf('pantone') > -1)
        const pIsNumeric = pTempNumeric >= 100 && pTempNumeric <= 5875
        return (pIsNumeric && pIsIndex) ? `${pTempNumeric}C` : false
    }

    // Check if variable is a numeric valid pantone
    let tempPantoneNumber = ''
    if (typeof pantoneInput === 'number') {
        return false // because it would interfere with hex
    } if (typeof pantoneInput === 'string' && pantoneInput.length >= 3 && _safeguard(pantoneInput, 'pantone')) {
        tempPantoneNumber = truePantone(pantoneInput)
    } else if (typeof pantoneInput === 'object'
        && pantoneInput.name && typeof pantoneInput.name === 'string' && pantoneInput.length >= 3) {
        tempPantoneNumber = truePantone(pantoneInput.name)
    }

    // Check if variable is a valid pantone list color
    if (tempPantoneNumber) {
        const tempPantoneArray = pantone.filter((a) => a.name === tempPantoneNumber)
        return (tempPantoneArray.length === 1) ? tempPantoneArray[0].name : false
    }
    return false
}

// 12 | --- Ral -----------------------------------------------------
colorSanitizer.ral = function sanitizeRAL(ralInput) {
    let _ral = ralInput
    function isRalNumeric(_ralColor) { return (_ralColor >= 1000 && _ralColor <= 9023) ? _ralColor : false }
    function isRalName(_ralColor) {
        const _ralTemp = _ralColor.replace(/ral|[^a-z]/g, '')
        if (_ralTemp.length >= 4) { return _ralTemp }
        return false
    }
    let temp = ''
    if (typeof _ral === 'number' && isRalNumeric(_ral)) {
        // pass ral as numeric value ral {3009}
        _ral = {
            ral: `${_ral}`,
        }
    } else if (typeof _ral === 'string' && _ral.indexOf('ral') > -1) {
        const ralFilterName = isRalName(_ral)
        const ralFilterNumber = isRalNumeric(makeInt(_ral.replace(/[^0-9]/g, '')))

        temp = (ralFilterName || ralFilterNumber)
            ? ral.filter((a) => a.name.toLowerCase() === ralFilterName || a.ral === ralFilterNumber) : false
    } else if (typeof _ral === 'object'
        && !_ral.ral && _ral.name && typeof _ral.name === 'string') {
        // pass ral as name value ral { ral: { name: 'oxide red', lrv: 5 },
        _ral.name = isRalName(_ral.name)
        temp = (_ral.name) ? ral.filter((a) => a.name === _ral.name) : false
    } else {
        // default normal value { ral: { ral: 3009, name: 'oxide red', lrv: 5 },
        temp = ral.filter((a) => a.ral === _ral.ral)
    }

    return temp.length ? temp[0].ral : false
}

// 13 | --- rgb -----------------------------------------------------
colorSanitizer.rgb = function sanitizeRGB(rgb) {
    let _rgb = rgb
    if (_safeguard(_rgb, 'rgb')) {
        // rgb = ReindexColor(rgb,'rgb',/(\d+)/)
        _rgb = ReindexColor(_rgb, 'rgb', /([0-9]*[.])?[0-9]?[0-9%]+/, true)
    }
    // if Array  convert to object is
    if (Array.isArray(_rgb)) {
        _rgb = arrayToObject(_rgb, 'rgb')
    }
    if (typeof _rgb === 'object') {
        for (const i of 'rgb') {
            _rgb[i] = abstractMakeInt(_rgb[i], 255)
            if (Number.isNaN(_rgb[i]) || _rgb[i] < 0 || _rgb[i] > 255) {
                return false
            }
        }
        return _rgb
    }
    // check if the object is ok
    return false
}

// 14 | --- rgba -----------------------------------------------------
colorSanitizer.rgba = function sanitizeRGBA(rgba) {
    let _rgba = rgba
    if (_safeguard(_rgba, 'rgba')) {
        _rgba = ReindexColor(_rgba, 'rgba', '([0-9]*[.])?[0-9]+')
    }
    if (Array.isArray(_rgba)) {
        _rgba = arrayToObject(_rgba, 'rgba')
    }
    if (typeof _rgba === 'object') {
        for (const i of 'rgb') {
            _rgba[i] = makeInt(_rgba[i])
            if (_rgba[i] < 0 || _rgba[i] > 255) {
                return false
            }
        }

        _rgba.a = parseFloat(_rgba.a)
        return (_rgba.a >= 0 && _rgba.a <= 1) ? _rgba : false
    }
    return false
}

// 15 | --- rgbdecimal -----------------------------------------------------
colorSanitizer.rgbdecimal = function sanitizeRGBD(rgb) {
    const _rgb = rgb
    if (typeof _rgb === 'string') {
        const numericData = _rgb.match(/(\d+)/g)
        if (_rgb.indexOf('rgb') > -1 || _rgb.indexOf('decimal') > -1) {
            return (numericData && numericData.length === 1) ? numericData : false
        }
        if (numericData && numericData.length === 1) {
            return makeInt(numericData[0]) > 65792 ? numericData : false
        }
    }

    return false
}

// 16 | --- w -----------------------------------------------------
colorSanitizer.w = function sanitizeW(w) {
    let _w = w
    if (typeof _w === 'string') {
        _w = makeInt(_w.replace(/[^0-9]/, ''))
    }
    if (typeof _w === 'number') {
        return (_w >= 380 && _w <= 780) ? _w : false
    }
    return false
}

// 17 | --- XYZ -----------------------------------------------------
colorSanitizer.xyz = function sanitizeXYZ(xyz) {
    let _xyz = xyz
    if (_safeguard(_xyz, 'xyz')) {
        _xyz = ReindexColor(_xyz, 'xyz', '[+-]?([0-9]*[.])?[0-9]+')
    }
    if (Array.isArray(_xyz)) {
        _xyz = arrayToObject(_xyz, 'xyz')
    }
    if (typeof _xyz === 'object') {
        for (const i of 'xyz') {
            _xyz[i] = makeInt(_xyz[i])
            if (_xyz[i] <= 0) {
                return false
            }
        }
        return _xyz
    }
    return false
}

// 18 | --- YUV -----------------------------------------------------
colorSanitizer.yuv = function sanitizingYuv(yuv) {
    let _yuv = yuv
    if (_safeguard(_yuv, 'yuv')) {
        _yuv = ReindexColor(_yuv, 'yuv', '[+-]?([0-9]*[.])?[0-9]+')
    }
    if (Array.isArray(_yuv)) {
        _yuv = arrayToObject(_yuv, 'yuv')
    }
    if (typeof _yuv === 'object') {
        for (const i of 'yuv') {
            _yuv[i] = makeInt(_yuv[i])
            if (i !== 'u' && _yuv[i] < 0) {
                return false
            }
        }
        return _yuv
    }
    return false
}

module.exports = colorSanitizer
