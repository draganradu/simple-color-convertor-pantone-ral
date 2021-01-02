const { html, pantone, ral } = require('color_library')
const deltaE = require('./compare_deltaE_CIE76.js')
const AcceptedColors = require('./_accepted_colors')

const colorConvertor = new AcceptedColors()

// 0 | --- Factory worker

const approxFix = (colorObject) => {
    const _this = { ...colorObject }
    for (const i in _this) {
        if (Object.prototype.hasOwnProperty.call(_this, i)) {
            _this[i] = (Math.round(_this[i] * 1000000000) / 1000000000)
        }
    }

    return _this
}

const splitCamelCase = (name) => name.replace(/([A-Z])/g, ' $1').trim()

const PullDataFromList = (listName, coloType, reference, query = 'name') => {
    const _this = listName.filter((a) => a[query] === reference)
    return (_this.length) ? _this[0][coloType] : false
}

const doubleString = (string) => {
    let _this = ''
    for (let index = 0; index < string.length; index++) {
        _this += string[index] + string[index]
    }
    return _this.toUpperCase()
}

const makeNumeric = (inputNumber) => {
    const _this = parseInt(inputNumber, 10)
    return Number.isNaN(_this) ? 0 : _this
}

// 1 | --- CMYK ---------------------------------------------------------
colorConvertor.cmyk.rgb = (cmyk) => ({
    r: Math.round(255 * (1 - cmyk.c / 100) * (1 - cmyk.k / 100)),
    g: Math.round(255 * (1 - cmyk.m / 100) * (1 - cmyk.k / 100)),
    b: Math.round(255 * (1 - cmyk.y / 100) * (1 - cmyk.k / 100)),
})

// 2 | --- Grayscale -----------------------------------------------------
colorConvertor.grayscale.cmyk = (grayscale) => ({
    c: 0, m: 0, y: 0, k: grayscale,
})

colorConvertor.grayscale.rgb = (_grayscale) => {
    const grayscale = Math.round((100 - _grayscale) / 0.392156862745098)
    return { r: grayscale, g: grayscale, b: grayscale }
}

colorConvertor.grayscale.w = () => ({ error: 'You can`t get the wavelength of no color' })

// 3 | --- Hex 3 ---------------------------------------------------------
colorConvertor.hex3.hex6 = (hex3) => doubleString(hex3)

// 4 | --- Hex 4 -----------------------------------------------------
colorConvertor.hex4.hex8 = (hex4) => doubleString(hex4)

colorConvertor.hex4.rgb = (hex4) => {
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
colorConvertor.hex6.hex3 = (hex6) => {
    const convertor = (a, b) => {
        let _this = ''
        _this = [a, b].join('')
        _this = Math.floor(parseInt(_this, 16) / 16)
        return _this.toString(16).toUpperCase()
    }
    return convertor(hex6[0], hex6[1]) + convertor(hex6[2], hex6[3]) + convertor(hex6[4], hex6[5])
}

colorConvertor.hex6.hex4 = (hex6) => (`${colorConvertor.hex6.hex3(hex6)}F`)

colorConvertor.hex6.hex8 = (hex6) => (`${hex6}FF`).toUpperCase()

colorConvertor.hex6.rgb = (hex6) => ({
    r: parseInt(hex6.substring(0, 2), 16),
    g: parseInt(hex6.substring(2, 4), 16),
    b: parseInt(hex6.substring(4, 6), 16),
})

// 6 | --- hex 8 -----------------------------------------------------
colorConvertor.hex8.rgb = (hex8) => {
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

colorConvertor.hex8.rgba = (hex8) => {
    const _this = colorConvertor.hex6.rgb(hex8.substring(0, 6))
    _this.a = Number((parseInt(hex8.substring(6, 8), 16) / 255).toFixed(2))

    return _this
}

// 7 | --- html  -----------------------------------------------------
colorConvertor.html.rgb = (htmlInput) => PullDataFromList(html, 'rgb', htmlInput)

// 8 | --- hsl -----------------------------------------------------
colorConvertor.hsl.rgb = (_hsl) => {
    const hsl = { ..._hsl }
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

colorConvertor.hsl.w = (hsl) => Math.round(620 - ((170 / 270) * hsl.h))

// 9 | --- hsv -----------------------------------------------------
colorConvertor.hsv.rgb = (_hsv) => {
    const hsv = { ..._hsv }
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
colorConvertor.lab.pantone = (labOrigin) => {
    const lab = { ...labOrigin }
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

colorConvertor.lab.ral = (lab) => {
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

colorConvertor.lab.rgb = (lab) => {
    const xyz = { x: 0, y: 0, z: 0 }
    const rgb = { r: 0, g: 0, b: 0 }

    xyz.y = (lab.l + 16) / 116
    xyz.x = lab.a / 500 + xyz.y
    xyz.z = xyz.y - lab.b / 200

    xyz.x = 0.95047 * (((xyz.x ** 3) > 0.008856) ? (xyz.x ** 3) : (xyz.x - 16 / 116) / 7.787)
    xyz.y = 1.00000 * (((xyz.y ** 3) > 0.008856) ? (xyz.y ** 3) : (xyz.y - 16 / 116) / 7.787)
    xyz.z = 1.08883 * (((xyz.z ** 3) > 0.008856) ? (xyz.z ** 3) : (xyz.z - 16 / 116) / 7.787)

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
colorConvertor.pantone.rgb = (pantoneInput) => PullDataFromList(pantone, 'rgb', pantoneInput)

colorConvertor.pantone.cmyk = (pantoneInput) => PullDataFromList(pantone, 'cmyk', pantoneInput)

colorConvertor.pantone.lab = (pantoneInput) => PullDataFromList(pantone, 'lab', pantoneInput)

// 12 | --- Ral -----------------------------------------------------
colorConvertor.ral.rgb = (ralInput) => PullDataFromList(ral, 'rgb', ralInput, 'ral')

colorConvertor.ral.cmyk = (ralInput) => PullDataFromList(ral, 'cmyk', ralInput, 'ral')

colorConvertor.ral.lab = (ralInput) => PullDataFromList(ral, 'lab', ralInput, 'ral')

// 13 | --- rgb -----------------------------------------------------
colorConvertor.rgb.hex6 = (_rgb) => {
    const rgbNormalize = (colorBase) => {
        let color = makeNumeric(colorBase)

        if (color < 16) {
            color = `0${Number(color).toString(16)}`
        } else {
            color = color.toString(16)
        }

        return color
    }

    const rgb = { ..._rgb }

    Object.keys(rgb).map((k) => { rgb[k] = rgbNormalize(rgb[k]) })

    return [rgb.r, rgb.g, rgb.b].join('').toUpperCase()
}

colorConvertor.rgb.rgba = (rgb) => Object.assign(rgb, { a: 1 })

colorConvertor.rgb.hsl = (_rgb) => {
    const rgb = { ..._rgb }
    const hsl = { h: 0, s: 0, l: 0 }

    Object.keys(rgb).map((k) => { rgb[k] /= 255 })

    // Min Max chanel val
    rgb.cmin = Math.min(rgb.r, rgb.g, rgb.b)
    rgb.cmax = Math.max(rgb.r, rgb.g, rgb.b)
    rgb.delta = rgb.cmax - rgb.cmin

    // Calculate hue
    if (rgb.delta === 0) {
        hsl.h = 0
    } else if (rgb.cmax === rgb.r) {
        hsl.h = Math.round((((rgb.g - rgb.b) / rgb.delta) % 6) * 60)
    } else if (rgb.cmax === rgb.g) {
        hsl.h = Math.round(((rgb.b - rgb.r) / rgb.delta + 2) * 60)
    } else {
        hsl.h = Math.round(((rgb.r - rgb.g) / rgb.delta + 4) * 60)
    }

    // Make negative hues positive behind 360°
    hsl.h = (hsl.h < 0) ? hsl.h + 360 : hsl.h
    hsl.l = (rgb.cmax + rgb.cmin) / 2
    hsl.s = rgb.delta === 0 ? 0 : rgb.delta / (1 - Math.abs(2 * hsl.l - 1))

    hsl.s = parseFloat((hsl.s * 100).toFixed(1))
    hsl.l = parseFloat((hsl.l * 100).toFixed(1))

    return approxFix(hsl)
}

colorConvertor.rgb.hsv = (_rgb) => {
    const rgb = { ..._rgb }

    Object.keys(rgb).map((k) => { rgb[k] /= 255 })

    const minRGB = Math.min(rgb.r, Math.min(rgb.g, rgb.b))
    const maxRGB = Math.max(rgb.r, Math.max(rgb.g, rgb.b))
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
        let d = ((rgb.b === minRGB) ? rgb.r - rgb.g : rgb.b - rgb.r)
        let h = (rgb.b === minRGB) ? 1 : 5
        if (rgb.r === minRGB) {
            d = (rgb.g - rgb.b)
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

colorConvertor.rgb.grayscale = (_rgb) => {
    if (_rgb) {
        const rgb = { ..._rgb }
        const grayscaleWhite = {
            r: 0.3,
            g: 0.59,
            b: 0.11,
        }

        Object.keys(rgb).map((k) => { rgb[k] = (255 - rgb[k]) * grayscaleWhite[k] })

        return Math.round((rgb.r + rgb.g + rgb.b) / 2.56)
    }
    return 100
}

colorConvertor.rgb.lab = (_rgb) => {
    const rgb = { ..._rgb }
    Object.keys(rgb).map((k) => {
        rgb[k] /= 255
        rgb[k] = (rgb[k] > 0.04045) ? (((rgb[k] + 0.055) / 1.055) ** 2.4) : rgb[k] / 12.92
    })

    const xyz = { x: 0, y: 0, z: 0 }

    xyz.x = (rgb.r * 0.4124 + rgb.g * 0.3576 + rgb.b * 0.1805) / 0.95047
    xyz.y = (rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722) / 1.00000
    xyz.z = (rgb.r * 0.0193 + rgb.g * 0.1192 + rgb.b * 0.9505) / 1.08883

    Object.keys(xyz).map((k) => { xyz[k] = (xyz[k] > 0.008856) ? (xyz[k] ** (1 / 3)) : (7.787 * xyz[k]) + 16 / 116 })

    const lab = { l: ((116 * xyz.y) - 16), a: (500 * (xyz.x - xyz.y)), b: (200 * (xyz.y - xyz.z)) }
    return approxFix(lab)
}

colorConvertor.rgb.cmyk = (_rgb) => {
    const rgb = { ..._rgb }
    const cmyk = {
        c: 0, m: 0, y: 0, k: 0,
    }

    if (rgb.r === 0 && rgb.g === 0 && rgb.b === 0) {
        cmyk.k = 100
    } else {
        Object.keys(rgb).map((k) => { rgb[k] /= 255 })

        cmyk.k = 1 - Math.max(rgb.r, rgb.g, rgb.b)

        if (cmyk.k !== 1) {
            cmyk.c = (1 - rgb.r - cmyk.k) / (1 - cmyk.k)
            cmyk.m = (1 - rgb.g - cmyk.k) / (1 - cmyk.k)
            cmyk.y = (1 - rgb.b - cmyk.k) / (1 - cmyk.k)

            Object.keys(cmyk).map((k) => { cmyk[k] = Math.round(cmyk[k] * 100) })
        }
    }
    return cmyk
}

colorConvertor.rgb.rgbdecimal = (rgb) => (rgb.r << 16) + (rgb.g << 8) + (rgb.b)

colorConvertor.rgb.html = (rgb) => {
    const _this = {
        index: 768,
        html: '',
    }

    const { r, g, b } = rgb
    for (const eHtml of html) {
        const t = Math.abs(eHtml.rgb.r - r) + Math.abs(eHtml.rgb.g - g) + Math.abs(eHtml.rgb.b - b)
        if (t < _this.index) {
            _this.index = t
            _this.html = splitCamelCase(eHtml.name)
            if (_this.index === 0) {
                return _this.html
            }
        }
    }

    return _this.html
}

colorConvertor.rgb.xyz = (_rgb) => {
    const pivot = (n) => (n > 0.04045 ? (((n + 0.055) / 1.055) ** 2.4) : n / 12.92) * 100.0

    const rgb = { ..._rgb }

    Object.keys(rgb).map((k) => { rgb[k] = pivot(rgb[k] / 255.0) })

    return {
        x: rgb.r * 0.4124 + rgb.g * 0.3576 + rgb.b * 0.1805,
        y: rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722,
        z: rgb.r * 0.0193 + rgb.g * 0.1192 + rgb.b * 0.9505,
    }
}

colorConvertor.rgb.yuv = (rgb) => {
    const yuv = { y: 0, u: 0, v: 0 }
    yuv.y = (0.257 * rgb.r) + (0.504 * rgb.g) + (0.098 * rgb.b) + 16
    yuv.u = (-0.148 * rgb.r) - (0.291 * rgb.g) + (0.439 * rgb.b) + 128
    yuv.v = (0.439 * rgb.r) - (0.368 * rgb.g) - (0.071 * rgb.b) + 128

    return yuv
}

// 14 | --- rgba -----------------------------------------------------
colorConvertor.rgba.rgb = (rgba) => {
    const rgb = { r: 0, g: 0, b: 0 }

    Object.keys(rgb).map((k) => { rgb[k] = Math.round(rgba[k] * rgba.a) })

    return rgb
}

// 14 | --- rgbdecimal -----------------------------------------------------

colorConvertor.rgbdecimal.rgb = (RGBd) => ({
    r: (RGBd & 0xff0000) >> 16,
    g: (RGBd & 0x00ff00) >> 8,
    b: (RGBd & 0x0000ff),
})

// 15 | --- w -----------------------------------------------------
colorConvertor.w.rgb = (w) => {
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

    Object.keys(rgb).map((k) => { rgb[k] = Math.round(rgb[k] * 255) })

    return rgb
}

// 16 | --- XYZ -----------------------------------------------------
colorConvertor.xyz.lab = (_xyz) => {
    const pivot = (n) => (n > 0.008856 ? (n ** 0.3333) : (903.3 * n + 16) / 116)

    const xyz = { ..._xyz }

    xyz.x /= 95.047
    xyz.y /= 100.000
    xyz.z /= 108.883

    Object.keys(xyz).map((k) => { xyz[k] = pivot(xyz[k]) })

    const lab = {
        l: Math.max(0, 116 * xyz.y - 16),
        a: 500 * (xyz.x - xyz.y),
        b: 200 * (xyz.y - xyz.z),
    }

    return approxFix(lab)
}

// 16 | --- YUV -----------------------------------------------------
colorConvertor.yuv.rgb = (yuv) => ({
    r: Math.round(yuv.y + (1.140 * yuv.v)),
    g: Math.round(yuv.y - (0.395 * yuv.v) - (0.581 * yuv.v)),
    b: Math.round(yuv.y + (2.032 * yuv.u)),
})

module.exports = colorConvertor
