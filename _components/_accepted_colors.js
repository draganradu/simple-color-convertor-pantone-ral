'use strict'

const _removeFromArray = require('../_components/frame/_remove_array_from_array')

class AcceptedColors {
    constructor () {
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

    get keys () {
        return Object.keys(this)
    }

    get paintKeys () {
        return _removeFromArray(this.keys,['ral', 'rgbdecimal' , 'pantone', 'grayscale', 'hex3', 'hex4', 'rgba', 'yuv'])
    }

    get sanitaryKeys () {
        return _removeFromArray(this.keys,['isHex', 'hex', 'isHexVerbos']).sort(function(a, b){
            return b.length - a.length
          })
    }
}

module.exports = AcceptedColors