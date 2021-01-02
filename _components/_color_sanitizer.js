const { html, pantone, ral } = require('color_library')
const _safeguard = require('./_color_safeguard')
const AcceptedColors = require('./_accepted_colors')
const ReindexColor = require('./_color_reindex')
const procent = require('./frame/_frame_procent_fix')
const { cloneData } = require('./frame/_frame_clone')

const colorSanitizer = new AcceptedColors()

const stringToArray = ({ colorName, colorData, regex }) => {
    if (_safeguard(colorData, colorName)) {
        return ReindexColor({ colorData, colorName, regex })
    }
    return colorData
}

const arrayToObject = ({ data, key }) => {
    if (Array.isArray(data) && data.length === key.length) {
        const _this = {}
        for (const i in key) {
            if (Object.prototype.hasOwnProperty.call(key, i)) {
                _this[key[i]] = data[i]
            }
        }
        return _this
    }
    return data
}

const makeInt = (inputNumber) => {
    const _this = parseInt(inputNumber, 10)
    return Number.isNaN(_this) ? 0 : _this
}

const makeFloat = (inputNumber) => {
    const _this = parseFloat(inputNumber)
    return Number.isNaN(_this) ? 0 : _this
}

const abstractMakeInt = (a, b = 100) => {
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
colorSanitizer.cmyk = (_cmyk) => {
    let cmyk = cloneData(_cmyk)

    cmyk = stringToArray({
        colorData: cmyk,
        colorName: 'cmyk',
        regex: /[+-]?([0-9]*[.])?[0-9]+/,
    })

    cmyk = arrayToObject({ data: cmyk, key: 'cmyk' })

    if (typeof cmyk === 'object') {
        for (const i of 'cmyk') {
            cmyk[i] = abstractMakeInt(cmyk[i])
            // validate on conversion
            if (Number.isNaN(cmyk[i]) || cmyk[i] < 0 || cmyk[i] > 100) {
                return false
            }
        }
        return cmyk
    }
    return false
}

// 2 | --- Grayscale -----------------------------------------------------
colorSanitizer.grayscale = (_grayscale) => {
    let grayscale = cloneData(_grayscale)

    if (!colorSanitizer.isHex(grayscale)) {
        // if string convert to number
        if (typeof grayscale === 'string' && grayscale.indexOf('rgb') === -1) {
            grayscale = makeInt(grayscale.replace(/%20|[^0-9]/g, ''))
        }
        // if string convert to number
        if (typeof grayscale === 'number' && grayscale >= 0 && grayscale <= 100) {
            return (grayscale >= 0 && grayscale <= 100) ? grayscale : true
        }
    }
    return false
}

// 3 | --- hex 3
colorSanitizer.hex = (hex) => {
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

colorSanitizer.isHex = (hex) => {
    const _this = colorSanitizer.hex(hex)
    return (_this) ? _this.length : false
}
// ------------- needs work
// ------------- return Array [HexSanitizedlength, sanitizedHex]

// 3 | --- Hex 3 ---------------------------------------------------------

colorSanitizer.hex3 = (hex) => {
    const _this = colorSanitizer.hex(hex)
    return (_this.length === 3) ? _this : false
}

// 4 | --- Hex 4 -----------------------------------------------------
colorSanitizer.hex4 = (hex) => {
    const _this = colorSanitizer.hex(hex)
    return (_this.length === 4) ? _this : false
}

// 5 | --- Hex 6 -----------------------------------------------------
colorSanitizer.hex6 = (hex) => {
    const _this = colorSanitizer.hex(hex)
    return (_this.length === 6) ? _this : false
}

// 6 | --- hex 8 -----------------------------------------------------
colorSanitizer.hex8 = (hex) => {
    const _this = colorSanitizer.hex(hex)
    return (_this.length === 8) ? _this : false
}

// 7 | --- html  -----------------------------------------------------
colorSanitizer.html = (htmlInput) => {
    if (_safeguard(htmlInput, 'html')) {
        const _htmlInput = htmlInput.toLowerCase().replace(/html|[^a-z]/g, '')
        const _this = html.filter((a) => a.name.toLowerCase() === _htmlInput)
        return (_this.length > 0) ? _this[0].name : false
    }
    return false
}
// ------------- needs work
// ------------- need some arlgortam to exclude mode then >= 3

// 8 | --- hsl -----------------------------------------------------
colorSanitizer.hsl = (hsl) => {
    let _hsl = cloneData(hsl)

    _hsl = stringToArray({
        colorData: _hsl,
        colorName: 'hsl',
        regex: /([0-9]*[.])?[0-9]+/,
    })

    _hsl = arrayToObject({ data: _hsl, key: 'hsl' })

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
colorSanitizer.hsv = (_hsv) => {
    let hsv = cloneData(_hsv)

    hsv = stringToArray({
        colorData: hsv,
        colorName: 'hsv',
        regex: /([0-9]*[.])?[0-9]+/,
    })

    hsv = arrayToObject({ data: hsv, key: 'hsv' })

    if (typeof hsv === 'object') {
        for (const i of 'hsv') {
            hsv[i] = makeFloat(hsv[i])
        }
        const { h, s, v } = hsv
        if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && v >= 0 && v <= 100) {
            if (procent.require(s, v)) {
                hsv.s *= 100
                hsv.v *= 100
            }
            return hsv
        }
    }
    return false
}

// 10 | --- Lab -----------------------------------------------------
colorSanitizer.lab = (_lab) => {
    let lab = cloneData(_lab)

    lab = stringToArray({
        colorData: lab,
        colorName: 'lab',
        regex: /[+-]?([0-9]*[.])?[0-9]+/,
    })

    lab = arrayToObject({ data: lab, key: 'lab' })

    if (typeof lab === 'object') {
        for (const i of 'lab') {
            lab[i] = parseFloat(lab[i])
        }

        const { l, a, b } = lab
        if (l >= 0 && l <= 100 && a >= -128 && a <= 127 && b >= -128 && b <= 127) {
            return lab
        }
    }
    return false
}

// 11 | --- Pantone -----------------------------------------------------
colorSanitizer.pantone = (pantoneInput) => {
    const truePantone = (panton) => {
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
colorSanitizer.ral = (ralInput) => {
    let _ral = cloneData(ralInput)
    const isRalNumeric = (_ralColor) => ((_ralColor >= 1000 && _ralColor <= 9023) ? _ralColor : false)
    const isRalName = (_ralColor) => {
        const _ralTemp = _ralColor.replace(/ral|[^a-z]/g, '')
        if (_ralTemp.length >= 4) { return _ralTemp }
        return false
    }
    let _this = ''
    if (typeof _ral === 'number' && isRalNumeric(_ral)) {
        // pass ral as numeric value ral {3009}
        _ral = {
            ral: `${_ral}`,
        }
    } else if (typeof _ral === 'string' && _ral.indexOf('ral') > -1) {
        const ralFilterName = isRalName(_ral)
        const ralFilterNumber = isRalNumeric(makeInt(_ral.replace(/[^0-9]/g, '')))

        _this = (ralFilterName || ralFilterNumber)
            ? ral.filter((a) => a.name.toLowerCase() === ralFilterName || a.ral === ralFilterNumber) : false
    } else if (typeof _ral === 'object'
        && !_ral.ral && _ral.name && typeof _ral.name === 'string') {
        // pass ral as name value ral { ral: { name: 'oxide red', lrv: 5 },
        _ral.name = isRalName(_ral.name)
        _this = (_ral.name) ? ral.filter((a) => a.name === _ral.name) : false
    } else {
        // default normal value { ral: { ral: 3009, name: 'oxide red', lrv: 5 },
        _this = ral.filter((a) => a.ral === _ral.ral)
    }

    return _this.length ? _this[0].ral : false
}

// 13 | --- rgb -----------------------------------------------------
colorSanitizer.rgb = (_rgb) => {
    let rgb = cloneData(_rgb)

    if (_safeguard(rgb, 'rgb')) {
        // rgb = ReindexColor(rgb,'rgb',/(\d+)/)

        rgb = ReindexColor({
            colorData: rgb,
            colorName: 'rgb',
            regex: /([0-9]*[.])?[0-9]?[0-9%]+/,
        })
    }

    rgb = arrayToObject({ data: rgb, key: 'rgb' })

    if (typeof rgb === 'object') {
        for (const i of 'rgb') {
            rgb[i] = abstractMakeInt(rgb[i], 255)
            if (Number.isNaN(rgb[i]) || rgb[i] < 0 || rgb[i] > 255) {
                return false
            }
        }
        return rgb
    }
    // check if the object is ok
    return false
}

// 14 | --- rgba -----------------------------------------------------
colorSanitizer.rgba = (_rgba) => {
    let rgba = cloneData(_rgba)

    rgba = stringToArray({
        colorData: rgba,
        colorName: 'rgba',
        regex: /([0-9]*[.])?[0-9]+/,
    })

    rgba = arrayToObject({ data: rgba, key: 'rgba' })

    if (typeof rgba === 'object') {
        for (const i of 'rgb') {
            rgba[i] = makeInt(rgba[i])
            if (rgba[i] < 0 || rgba[i] > 255) {
                return false
            }
        }

        rgba.a = parseFloat(rgba.a)
        return (rgba.a >= 0 && rgba.a <= 1) ? rgba : false
    }
    return false
}

// 15 | --- rgbdecimal -----------------------------------------------------
colorSanitizer.rgbdecimal = (_rgb) => {
    const rgb = cloneData(_rgb)
    if (typeof rgb === 'string') {
        const numericData = rgb.match(/(\d+)/g)
        if (rgb.indexOf('rgb') > -1 || rgb.indexOf('decimal') > -1) {
            return (numericData && numericData.length === 1) ? numericData : false
        }
        if (numericData && numericData.length === 1) {
            return makeInt(numericData[0]) > 65792 ? numericData : false
        }
    }

    return false
}

// 16 | --- w -----------------------------------------------------
colorSanitizer.w = (_w) => {
    let w = cloneData(_w)

    if (typeof w === 'string') {
        w = makeInt(w.replace(/[^0-9]/, ''))
    }

    if (typeof w === 'number') {
        return (w >= 380 && w <= 780) ? w : false
    }

    return false
}

// 17 | --- XYZ -----------------------------------------------------
colorSanitizer.xyz = (_xyz) => {
    let xyz = cloneData(_xyz)

    xyz = stringToArray({
        colorData: xyz,
        colorName: 'xyz',
        regex: /[+-]?([0-9]*[.])?[0-9]+/,
    })

    xyz = arrayToObject({ data: xyz, key: 'xyz' })

    if (typeof xyz === 'object') {
        for (const i of 'xyz') {
            xyz[i] = makeInt(xyz[i])
            if (xyz[i] <= 0) {
                return false
            }
        }
        return xyz
    }
    return false
}

// 18 | --- YUV -----------------------------------------------------
colorSanitizer.yuv = (_yuv) => {
    let yuv = cloneData(_yuv)

    yuv = stringToArray({
        colorData: yuv,
        colorName: 'yuv',
        regex: /[+-]?([0-9]*[.])?[0-9]+/,
    })

    yuv = arrayToObject({ data: yuv, key: 'yuv' })

    if (typeof yuv === 'object') {
        for (const i of 'yuv') {
            yuv[i] = makeInt(yuv[i])
            if (i !== 'u' && yuv[i] < 0) {
                return false
            }
        }
        return yuv
    }
    return false
}

module.exports = colorSanitizer
