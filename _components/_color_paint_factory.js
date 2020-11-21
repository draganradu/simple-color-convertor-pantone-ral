const { html, pantone, ral } = require('color_library')
const deltaE = require('./compare_deltaE_CIE76.js')
const AcceptedColors = require('./_accepted_colors')

const colorConvertor = new AcceptedColors()

// 0 | --- Factory worker

function splitCamelCase(name) {
    return name.replace(/([A-Z])/g, ' $1').trim()
}

function PullDataFromList(listName, coloType, reference, query = 'name') {
    const _this = listName.filter((a) => a[query] === reference)
    return (_this.length) ? _this[0][coloType] : false
}

function doubleString(string) {
    let _this = ''
    for (let index = 0; index < string.length; index++) {
        _this += string[index] + string[index]
    }
    return _this.toUpperCase()
}

function makeNumeric(inputNumber) {
    const _this = parseInt(inputNumber, 10)
    return Number.isNaN(_this) ? 0 : _this
}

// 1 | --- CMYK ---------------------------------------------------------
colorConvertor.cmyk.rgb = function convertCmykRgb(cmyk) {
    return {
        r: Math.round(255 * (1 - cmyk.c / 100) * (1 - cmyk.k / 100)),
        g: Math.round(255 * (1 - cmyk.m / 100) * (1 - cmyk.k / 100)),
        b: Math.round(255 * (1 - cmyk.y / 100) * (1 - cmyk.k / 100)),
    }
}

// 2 | --- Grayscale -----------------------------------------------------
colorConvertor.grayscale.cmyk = function convertGrayscaleCmyk(grayscale) {
    return {
        c: 0, m: 0, y: 0, k: grayscale,
    }
}

colorConvertor.grayscale.rgb = function convertGrayscaleRgb(_grayscale) {
    const grayscale = Math.round((100 - _grayscale) / 0.392156862745098)
    return { r: grayscale, g: grayscale, b: grayscale }
}

colorConvertor.grayscale.w = function convertGrayscaleW() {
    return { error: 'You can`t get the wavelength of no color' }
}

// 3 | --- Hex 3 ---------------------------------------------------------
colorConvertor.hex3.hex6 = function convertHex3hex6(hex3) {
    return doubleString(hex3)
}

// 4 | --- Hex 4 -----------------------------------------------------
colorConvertor.hex4.hex8 = function convertHex4hex8(hex4) {
    return doubleString(hex4)
}

colorConvertor.hex4.rgb = function convertHex4Rgb(hex4) {
    const _this = {
        color: colorConvertor.hex6.rgb(colorConvertor.hex3.hex6(hex4.substring(0, 3))),
        opacity: parseInt([hex4.substring(3, 4), hex4.substring(3, 4)].join(''), 16) / 255,
    }

    for (const i in _this.color) {
        if (Object.prototype.hasOwnProperty.call(_this.color, i)) {
            _this.color[i] *= _this.opacity
            _this.color[i] = Math.round(_this.color[i])
        }
    }
    return _this.color
}

// 5 | --- Hex 6 -----------------------------------------------------
colorConvertor.hex6.hex3 = function convertHex6Hex3(hex6) {
    function convertor(a, b) {
        let _this = ''
        _this = [a, b].join('')
        _this = Math.floor(parseInt(_this, 16) / 16)
        return _this.toString(16).toUpperCase()
    }
    return convertor(hex6[0], hex6[1]) + convertor(hex6[2], hex6[3]) + convertor(hex6[4], hex6[5])
}

colorConvertor.hex6.hex4 = function convertHex6Hex4(hex6) {
    return (`${colorConvertor.hex6.hex3(hex6)}F`)
}

colorConvertor.hex6.hex8 = function convertHex6Hex8(hex6) {
    return (`${hex6}FF`).toUpperCase()
}

colorConvertor.hex6.rgb = function convertHex6Rgb(hex6) {
    return {
        r: parseInt(hex6.substring(0, 2), 16),
        g: parseInt(hex6.substring(2, 4), 16),
        b: parseInt(hex6.substring(4, 6), 16),
    }
}

// 6 | --- hex 8 -----------------------------------------------------
colorConvertor.hex8.rgb = function convertHex8Rgb(hex8) {
    const _this = {
        color: colorConvertor.hex6.rgb(hex8.substring(0, 6)),
        opacity: parseInt(hex8.substring(6, 8), 16) / 255,
    }

    for (const i in _this.color) {
        if (Object.prototype.hasOwnProperty.call(_this.color, i)) {
            _this.color[i] *= _this.opacity
            _this.color[i] = Math.round(_this.color[i])
        }
    }

    return _this.color
}

colorConvertor.hex8.rgba = function convertHex8Rgba(hex8) {
    const _this = colorConvertor.hex6.rgb(hex8.substring(0, 6))
    _this.a = Number((parseInt(hex8.substring(6, 8), 16) / 255).toFixed(2))

    return _this
}

// 7 | --- html  -----------------------------------------------------
colorConvertor.html.rgb = function convertHtmlRgb(htmlInput) {
    return PullDataFromList(html, 'rgb', htmlInput)
}

// 8 | --- hsl -----------------------------------------------------
colorConvertor.hsl.rgb = function convertHslRgb(_hsl) {
    const hsl = _hsl
    const rgb = { r: 0, g: 0, b: 0 }

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
    for (const i of 'rgb') {
        rgb[i] = Math.round((rgb[i] + hsl.m) * 255)
    }

    return rgb
}

colorConvertor.hsl.w = function convertHslW(hsl) {
    return Math.round(620 - ((170 / 270) * hsl.h))
}

// 9 | --- hsv -----------------------------------------------------
colorConvertor.hsv.rgb = function convertHsvRgb(_hsv) {
    const hsv = _hsv
    hsv.h /= 360
    hsv.s /= 100
    hsv.v /= 100

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
    default:
        return false
    }
}

// 10 | --- Lab -----------------------------------------------------
colorConvertor.lab.pantone = function convertLabPantone(labOrigin) {
    const lab = Object.create(labOrigin)
    const _this = {
        index: 768,
        name: '',
    }

    for (const elementPantone of pantone) {
        const t = deltaE(elementPantone.lab, lab)
        if (t < _this.index) {
            _this.index = t
            _this.name = elementPantone.name
            if (_this.index === 1) {
                return _this.name
            }
        }
    }

    return _this.name
}

colorConvertor.lab.ral = function convertLabRal(lab) {
    const _this = {
        index: 768,
        position: ral.length - 1,
    }

    for (const elementRal in ral) {
        if (Object.prototype.hasOwnProperty.call(ral, elementRal)) {
            const t = deltaE(ral[elementRal].lab, lab)
            if (t < _this.index) {
                _this.index = t
                _this.position = elementRal
                if (_this.index === 0) {
                    return {
                        ral: ral[_this.position].ral,
                        name: splitCamelCase(ral[_this.position].name),
                        lrv: ral[_this.position].LRV,
                    }
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

colorConvertor.lab.rgb = function convertLabRgb(lab) {
    const xyz = { x: 0, y: 0, z: 0 }

    xyz.y = (lab.l + 16) / 116
    xyz.x = lab.a / 500 + xyz.y
    xyz.z = xyz.y - lab.b / 200

    xyz.x = 0.95047 * (((xyz.x ** 3) > 0.008856) ? (xyz.x ** 3) : (xyz.x - 16 / 116) / 7.787)
    xyz.y = 1.00000 * (((xyz.y ** 3) > 0.008856) ? (xyz.y ** 3) : (xyz.y - 16 / 116) / 7.787)
    xyz.z = 1.08883 * (((xyz.z ** 3) > 0.008856) ? (xyz.z ** 3) : (xyz.z - 16 / 116) / 7.787)

    const rgb = { r: 0, g: 0, b: 0 }
    rgb.r = xyz.x * 3.2406 + xyz.y * -1.5372 + xyz.z * -0.4986
    rgb.g = xyz.x * -0.9689 + xyz.y * 1.8758 + xyz.z * 0.0415
    rgb.b = xyz.x * 0.0557 + xyz.y * -0.2040 + xyz.z * 1.0570

    for (const i of 'rgb') {
        rgb[i] = (rgb[i] > 0.0031308) ? (1.055 * (rgb[i] ** (1 / 2.4)) - 0.055) : 12.92 * rgb[i]
        rgb[i] = Math.round(Math.max(0, Math.min(1, rgb[i])) * 255)
    }

    return rgb
}

// 11 | --- Pantone -----------------------------------------------------
colorConvertor.pantone.rgb = function convertPantoneRgb(pantoneInput) {
    return PullDataFromList(pantone, 'rgb', pantoneInput)
}

colorConvertor.pantone.cmyk = function convertPantoneCmyk(pantoneInput) {
    return PullDataFromList(pantone, 'cmyk', pantoneInput)
}

colorConvertor.pantone.lab = function convertPantoneLab(pantoneInput) {
    return PullDataFromList(pantone, 'lab', pantoneInput)
}

// 12 | --- Ral -----------------------------------------------------
colorConvertor.ral.rgb = function convertRalRgb(ralInput) {
    return PullDataFromList(ral, 'rgb', ralInput, 'ral')
}

colorConvertor.ral.cmyk = function convertRalCmyk(ralInput) {
    return PullDataFromList(ral, 'cmyk', ralInput, 'ral')
}

colorConvertor.ral.lab = function convertRalLab(ralInput) {
    return PullDataFromList(ral, 'lab', ralInput, 'ral')
}

// 13 | --- rgb -----------------------------------------------------
colorConvertor.rgb.hex6 = function convertRgbHex6(rgb) {
    function rgbNormalize(colorBase) {
        let color = makeNumeric(colorBase)

        if (color < 16) {
            color = `0${Number(color).toString(16)}`
        } else {
            color = color.toString(16)
        }

        return color
    }
    return [rgbNormalize(rgb.r), rgbNormalize(rgb.g), rgbNormalize(rgb.b)].join('').toUpperCase()
}

colorConvertor.rgb.rgba = function convertRgbRgba(rgb) {
    return Object.assign(rgb, { a: 1 })
}

colorConvertor.rgb.hsl = function convertRgbHsl(rgb) {
    const _rgb = rgb
    const hsl = { h: 0, s: 0, l: 0 }
    for (const i of 'rgb') {
        _rgb[i] /= 255
    }

    // Min Max chanel val
    _rgb.cmin = Math.min(_rgb.r, _rgb.g, _rgb.b)
    _rgb.cmax = Math.max(_rgb.r, _rgb.g, _rgb.b)
    _rgb.delta = _rgb.cmax - _rgb.cmin

    // Calculate hue
    if (_rgb.delta === 0) {
        hsl.h = 0
    } else if (_rgb.cmax === _rgb.r) {
        hsl.h = Math.round((((_rgb.g - _rgb.b) / _rgb.delta) % 6) * 60)
    } else if (_rgb.cmax === _rgb.g) {
        hsl.h = Math.round(((_rgb.b - _rgb.r) / _rgb.delta + 2) * 60)
    } else {
        hsl.h = Math.round(((_rgb.r - _rgb.g) / _rgb.delta + 4) * 60)
    }

    // Make negative hues positive behind 360°
    hsl.h = (hsl.h < 0) ? hsl.h + 360 : hsl.h

    hsl.l = (_rgb.cmax + _rgb.cmin) / 2

    hsl.s = _rgb.delta === 0 ? 0 : _rgb.delta / (1 - Math.abs(2 * hsl.l - 1))

    hsl.s = parseFloat((hsl.s * 100).toFixed(1))
    hsl.l = parseFloat((hsl.l * 100).toFixed(1))

    return hsl
}

colorConvertor.rgb.hsv = function convertRgbHsv(rgb) {
    const _rgb = rgb
    for (const i of 'rgb') {
        _rgb[i] /= 255
    }

    const minRGB = Math.min(_rgb.r, Math.min(_rgb.g, _rgb.b))
    const maxRGB = Math.max(_rgb.r, Math.max(_rgb.g, _rgb.b))
    let hsv = false

    if (minRGB === maxRGB) {
        // grayscale
        hsv = {
            h: 0,
            s: 0,
            v: minRGB * 100,
        }
    } else {
        // color
        let d = ((_rgb.b === minRGB) ? _rgb.r - _rgb.g : _rgb.b - _rgb.r)
        let h = (_rgb.b === minRGB) ? 1 : 5
        if (_rgb.r === minRGB) {
            d = (_rgb.g - _rgb.b)
            h = 3
        }

        hsv = {
            h: 60 * (h - d / (maxRGB - minRGB)),
            s: ((maxRGB - minRGB) / maxRGB) * 100,
            v: (maxRGB) * 100,
        }
    }

    return hsv
}

colorConvertor.rgb.grayscale = function convertRgbGrayscale(rgb) {
    if (rgb) {
        const _rgb = rgb
        const grayscaleWhite = {
            r: 0.3,
            g: 0.59,
            b: 0.11,
        }

        for (const i of 'rgb') {
            _rgb[i] = (255 - _rgb[i]) * grayscaleWhite[i]
        }
        return Math.round((_rgb.r + _rgb.g + _rgb.b) / 2.56)
    }
    return 100
}

colorConvertor.rgb.lab = function convertRgbLab(rgb) {
    const _rgb = rgb
    for (const i of 'rgb') {
        _rgb[i] /= 255
    }

    _rgb.r = (_rgb.r > 0.04045) ? (((_rgb.r + 0.055) / 1.055) ** 2.4) : _rgb.r / 12.92
    _rgb.g = (_rgb.g > 0.04045) ? (((_rgb.g + 0.055) / 1.055) ** 2.4) : _rgb.g / 12.92
    _rgb.b = (_rgb.b > 0.04045) ? (((_rgb.b + 0.055) / 1.055) ** 2.4) : _rgb.b / 12.92

    const xyz = { x: 0, y: 0, z: 0 }

    xyz.x = (_rgb.r * 0.4124 + _rgb.g * 0.3576 + _rgb.b * 0.1805) / 0.95047
    xyz.y = (_rgb.r * 0.2126 + _rgb.g * 0.7152 + _rgb.b * 0.0722) / 1.00000
    xyz.z = (_rgb.r * 0.0193 + _rgb.g * 0.1192 + _rgb.b * 0.9505) / 1.08883

    xyz.x = (xyz.x > 0.008856) ? (xyz.x ** (1 / 3)) : (7.787 * xyz.x) + 16 / 116
    xyz.y = (xyz.y > 0.008856) ? (xyz.y ** (1 / 3)) : (7.787 * xyz.y) + 16 / 116
    xyz.z = (xyz.z > 0.008856) ? (xyz.z ** (1 / 3)) : (7.787 * xyz.z) + 16 / 116

    return { l: ((116 * xyz.y) - 16), a: (500 * (xyz.x - xyz.y)), b: (200 * (xyz.y - xyz.z)) }
}

colorConvertor.rgb.cmyk = function convertRgbCmyk(rgb) {
    const _rgb = rgb
    const cmyk = {
        c: 0, m: 0, y: 0, k: 0,
    }

    if (_rgb.r === 0 && _rgb.g === 0 && _rgb.b === 0) {
        cmyk.k = 100
    } else {
        for (const i of '_rgb') {
            _rgb[i] /= 255
        }

        cmyk.k = 1 - Math.max(_rgb.r, _rgb.g, _rgb.b)

        if (cmyk.k !== 1) {
            cmyk.c = (1 - _rgb.r - cmyk.k) / (1 - cmyk.k)
            cmyk.m = (1 - _rgb.g - cmyk.k) / (1 - cmyk.k)
            cmyk.y = (1 - _rgb.b - cmyk.k) / (1 - cmyk.k)

            for (const i of 'cmyk') {
                cmyk[i] = Math.round(cmyk[i] * 100)
            }
        }
    }
    return cmyk
}

colorConvertor.rgb.rgbdecimal = function convertRgbDecimal(rgb) {
    return (rgb.r << 16) + (rgb.g << 8) + (rgb.b)
}

colorConvertor.rgb.html = function convertRgbHtml(rgb) {
    const _this = {
        index: 768,
        html: '',
    }
    const { r, g, b } = rgb
    for (const elementHtml of html) {
        const t = Math.abs(elementHtml.rgb.r - r) + Math.abs(elementHtml.rgb.g - g) + Math.abs(elementHtml.rgb.b - b)
        if (t < _this.index) {
            _this.index = t
            _this.html = splitCamelCase(elementHtml.name)
            if (_this.index === 0) {
                return _this.html
            }
        }
    }

    return _this.html
}

colorConvertor.rgb.xyz = function convertRgbXyz(rgb) {
    const _rgb = rgb
    function pivot(n) {
        return (n > 0.04045 ? (((n + 0.055) / 1.055) ** 2.4) : n / 12.92) * 100.0
    }

    for (const i of 'rgb') {
        _rgb[i] = pivot(_rgb[i] / 255.0)
    }

    return {
        x: _rgb.r * 0.4124 + _rgb.g * 0.3576 + _rgb.b * 0.1805,
        y: _rgb.r * 0.2126 + _rgb.g * 0.7152 + _rgb.b * 0.0722,
        z: _rgb.r * 0.0193 + _rgb.g * 0.1192 + _rgb.b * 0.9505,
    }
}

colorConvertor.rgb.yuv = function convertRgbYuv(rgb) {
    const yuv = { y: 0, u: 0, v: 0 }
    yuv.y = (0.257 * rgb.r) + (0.504 * rgb.g) + (0.098 * rgb.b) + 16
    yuv.u = (-0.148 * rgb.r) - (0.291 * rgb.g) + (0.439 * rgb.b) + 128
    yuv.v = (0.439 * rgb.r) - (0.368 * rgb.g) - (0.071 * rgb.b) + 128

    return yuv
}

// 14 | --- rgba -----------------------------------------------------
colorConvertor.rgba.rgb = function convertRgbaRGB(rgba) {
    const _this = {}

    for (const i of 'rgb') {
        _this[i] = Math.round(rgba[i] * rgba.a)
    }

    return _this
}

// 14 | --- rgbdecimal -----------------------------------------------------

colorConvertor.rgbdecimal.rgb = function convertRgbDRgb(RGBdecimal) {
    return {
        r: (RGBdecimal & 0xff0000) >> 16,
        g: (RGBdecimal & 0x00ff00) >> 8,
        b: (RGBdecimal & 0x0000ff),
    }
}

// 15 | --- w -----------------------------------------------------
colorConvertor.w.rgb = function convertWRgb(w) {
    const rgb = { r: 0, g: 0, b: 0 }

    if (w >= 380 && w < 440) {
        rgb.r = (-1 * (w - 440)) / (440 - 380)
        rgb.b = 1
    } else if (w >= 440 && w < 490) {
        rgb.g = (w - 440) / (490 - 440)
        rgb.b = 1
    } else if (w >= 490 && w < 510) {
        rgb.g = 1
        rgb.b = (-1 * (w - 510)) / (510 - 490)
    } else if (w >= 510 && w < 580) {
        rgb.r = (w - 510) / (580 - 510)
        rgb.g = 1
    } else if (w >= 580 && w < 645) {
        rgb.r = 1
        rgb.g = (-1 * (w - 645)) / (645 - 580)
    } else if (w >= 645 && w <= 780) {
        rgb.r = 1
    }

    for (const i of 'rgb') {
        rgb[i] = Math.round(rgb[i] * 255)
    }

    return rgb
}

// 16 | --- XYZ -----------------------------------------------------
colorConvertor.xyz.lab = function convertXyzLab(xyz) {
    function pivot(n) {
        return n > 0.008856 ? (n ** 0.3333) : (903.3 * n + 16) / 116
    }

    const x = pivot(xyz.x / 95.047)
    const y = pivot(xyz.y / 100.000)
    const z = pivot(xyz.z / 108.883)

    return {
        l: Math.max(0, 116 * y - 16),
        a: 500 * (x - y),
        b: 200 * (y - z),
    }
}

// 16 | --- YUV -----------------------------------------------------
colorConvertor.yuv.rgb = function convertYuvRGB(yuv) {
    return {
        r: Math.round(yuv.y + (1.140 * yuv.v)),
        g: Math.round(yuv.y - (0.395 * yuv.v) - (0.581 * yuv.v)),
        b: Math.round(yuv.y + (2.032 * yuv.u)),
    }
}

module.exports = colorConvertor
