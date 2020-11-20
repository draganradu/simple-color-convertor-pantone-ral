'use strict'

// safeguard function is used to prevent string that contain obvious strings to be excluded
const AcceptedColors = require('./_accepted_colors')

module.exports = function (colorString, probableColor) {
    if (typeof colorString !== 'string') { return false }

    const _this = {
        colorString: colorString,
        probableColor: probableColor,

        get acceptedColors () {
            return new AcceptedColors().keys.filter(a => a !== 'w').concat(['hex'])
        },

        fullMatch : function (i) {
            return (_this.colorString.indexOf(i) > -1)
        }
    }
    if(_this.fullMatch(_this.probableColor)){
        return true
    } else {
        for (const i of _this.acceptedColors) {
            if(_this.fullMatch(i)){
                return false
            }
        }
    }

    return true
}