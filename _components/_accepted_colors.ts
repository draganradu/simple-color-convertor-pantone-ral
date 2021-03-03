const { _removeFromArray } = require('./helper')

class AcceptedColors {
    cmyk : {}
    grayscale : {}
    hex3 : {}
    hex4 : {}
    hex6 : {}
    hex8 : {}
    html : {}
    hsl : {}
    hsv : {}
    lab : {}
    pantone : {}
    ral : {}
    rgb : {}
    rgba : {}
    rgbdecimal : {}
    w : {}
    xyz : {}
    yuv : {}

    constructor() {
        this.cmyk = {}
        this.grayscale = {}
        this.hex3 = {}
        this.hex4 = {}
        this.hex6 = {}
        this.hex8 = {}
        this.html = {}
        this.hsl = {}
        this.hsv = {}
        this.lab = {}
        this.pantone = {}
        this.ral = {}
        this.rgb = {}
        this.rgba = {}
        this.rgbdecimal = {}
        this.w = {}
        this.xyz = {}
        this.yuv = {}
    }

    get keys() {
        return Object.keys(this)
    }

    get paintKeys() {
        return _removeFromArray(this.keys, ['ral', 'rgbdecimal', 'pantone', 'grayscale', 'hex3', 'hex4', 'rgba', 'yuv'])
    }

    get sanitaryKeys() {
        return _removeFromArray(this.keys, ['isHex', 'hex', 'isHexVerbos']).sort((a, b) => b.length - a.length)
    }
}

module.exports = AcceptedColors