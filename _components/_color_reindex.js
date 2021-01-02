module.exports = ({ colorData, colorName, regex }) => {
    // stop it impossible due to length
    if (colorData.length < (colorName.length + (colorName.length - 1))) { return false }

    const _this = {
        tempOut: {},
        regexColorMatch: new RegExp(regex, 'g') || new RegExp('/(d+)/', 'g'),

        get perfectMatch() {
            return colorData.indexOf(colorName) > -1
        },

        get partialMatch() {
            let requiredLetters = colorName.length
            for (const i of colorName) {
                if (colorData.indexOf(i) > -1) {
                    requiredLetters -= 1
                }
            }

            return requiredLetters === 0
        },

        get preventNoFormatReindex() {
            if (colorName === 'hsl' || colorName === 'hsv') {
                if (colorData.indexOf('°') === -1) {
                    return false
                }
            }
            return true
        },
    }

    if (_this.perfectMatch) {
        // perfect match
        _this.tempOut = colorData.match(_this.regexColorMatch)
        if (_this.tempOut.length === colorName.length) {
            return _this.tempOut
        }
    } else if (_this.partialMatch) {
        // partial - runs unordered reindex
        for (const i of colorName) {
            const colorIndex = colorData.indexOf(i) + 1
            const match = colorData.substring(colorIndex).match(_this.regexColorMatch)
            if (match) {
                const [a] = match
                _this.tempOut[i] = a
            }
        }

        return (_this.tempOut) ? _this.tempOut : false
    } else if (_this.preventNoFormatReindex) {
        // no match - unordered reindexing
        const match = colorData.match(_this.regexColorMatch)
        if (match && match.length === colorName.length) {
            for (let i = 0; i < colorName.length; i++) {
                _this.tempOut[colorName[i]] = match[i]
            }
            return _this.tempOut
        }
    }
    return false
}
