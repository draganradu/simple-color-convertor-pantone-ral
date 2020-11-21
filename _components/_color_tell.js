const _colorSanitizer = require('./_color_sanitizer')

module.exports = function colorTell(data) {
    function everyKeyIndexOf(keys, string) {
        for (const i of keys) {
            if (string.indexOf(i) === -1) {
                return false
            }
        }

        return true
    }

    function ColorHasKeys(color, rawData) {
        for (let i = 0; i < color.length; i++) {
            if (!Object.prototype.hasOwnProperty.call(rawData, color[i])) {
                return false
            }
        }
        return true
    }

    if (typeof data === 'number') {
        for (const i of ['grayscale', 'w', 'ral']) {
            if (_colorSanitizer[i](data)) {
                return i
            }
        }
    } else if (typeof data === 'object') {
        for (const i of _colorSanitizer.sanitaryKeys) {
            if (ColorHasKeys(i, data)) {
                return i
            }
        }
    } else if (typeof data === 'string') {
        // this works the others not so much
        // ------------------------------------------------------------------------
        // 1 | run index of if value is found in color it is probably that

        for (const i of _colorSanitizer.sanitaryKeys) {
            if ((data.indexOf(i) > -1 || everyKeyIndexOf(i, data)) && _colorSanitizer[i](data)) {
                return i
            }
        }

        // 2| run sanitizer if value is acceptable it is returned
        for (const i of _colorSanitizer.sanitaryKeys) {
            const tempSanitized = _colorSanitizer[i](data)

            if (tempSanitized) {
                return i
            }
        }
        return false
    }

    return false
}
