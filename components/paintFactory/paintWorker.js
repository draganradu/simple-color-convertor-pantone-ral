//-- painter`s assistant

function doubleString(string) {
    let _this = ''
    for (let index = 0; index < string.length; index++) {
        _this += string[index] + string[index]
    }
    return _this.toUpperCase()
}

//-- painter

const _this = {
    hex3: {},
    hex6: {},
    rgb: {},
}

_this.hex3.hex6 = (hex3) => {
    return doubleString(hex3)
}

_this.rgb.hex6 = (rgb) => {
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

_this.hex6.rgb = (hex6) => {
    return {
        r: parseInt(hex6.substring(0, 2), 16),
        g: parseInt(hex6.substring(2, 4), 16),
        b: parseInt(hex6.substring(4, 6), 16),
    }
}

module.exports = _this