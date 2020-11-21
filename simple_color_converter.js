const _colorFactory = require('./_components/_color_paint_factory')
const _colorSanitizer = require('./_components/_color_sanitizer')
const _colorTell = require('./_components/_color_tell')
const _permutation = require('./_components/frame/_frame_permutation')

const _clone = require('./_components/frame/_frame_clone')
const _removeFromArray = require('./_components/frame/_remove_array_from_array')

class color {
    constructor(settingsArg = {}) {
        // get settings
        this.settings = _clone(settingsArg)
        this.sanitizeAlternativeKeys()
        this.debug = settingsArg.debug || false
        this.error = ''
        this.grayscale = this.settings.grayscale || false

        // set from and to
        this.from = this.sanitizeFrom(this.settings) || false
        this.to = this.sanitizeTo(this.from, this.settings.to) || false

        // run extra work for flags
        this.extraStepsForGrayscale()

        // sanitize colors
        this.color = (this.from && this.to) ? _colorSanitizer[this.from](this.settings[this.from]) : false

        // convert
        this.color = this.ColorConvert(this.color, this.to)

        // build extra hex3 for
        this.hexRefBuild()

        // build extra hex3 for
        this.cleanUp()
    }

    extraStepsForGrayscale() {
        if (!this.error && this.grayscale === true) {
            const LastColorStep = this.to.pop()
            const tempTo = [
                this.sanitizeTo(LastColorStep, 'grayscale'),
                this.sanitizeTo('grayscale', LastColorStep),
            ]
            if (tempTo[0] && tempTo[1]) {
                tempTo[0].pop()
                this.to = this.to.concat(tempTo[0], tempTo[1])
            }
        }
    }

    hexRefBuild() {
        if (this.settings.hexref) {
            const lastElement = this.to[this.to.length - 1]
            const stepsTemp = this.sanitizeTo(lastElement, 'hex6')

            if (lastElement === 'ral' || lastElement === 'html') {
                this.hexref = this.ColorConvert(_colorSanitizer[lastElement](this.color), stepsTemp)
            } else {
                this.hexref = this.ColorConvert(this.color, stepsTemp)
            }

            return true
        }
        return false
    }

    sanitizeAlternativeKeys() {
        const clean = {
            removeKey: 'hex',
            setKey: 'hex',
        }

        if (Object.prototype.hasOwnProperty.call(this.settings, 'hex')
            && _colorSanitizer.hex(this.settings.hex)) {
            clean.setKey += _colorSanitizer.hex(this.settings.hex).length
        } else if (Object.prototype.hasOwnProperty.call(this.settings, 'android')
            && _colorSanitizer.hex(this.settings.android)) {
            clean.removeKey = 'android'
            clean.setKey += _colorSanitizer.hex(this.settings.android).length
        }

        if (clean.setKey && clean.removeKey) {
            this.settings[clean.setKey] = this.settings[clean.removeKey]
            delete this.settings[clean.removeKey]
        }
    }

    sanitizeExceptionsFrom(parameters) {
        // remove the elements that are not colors
        const _parameters = _removeFromArray(parameters, ['to', 'hexref', 'debug'])

        // Figure out wildcard colors
        const parametersException = _parameters.filter((from) => ['color', 'from'].indexOf(from) > -1)

        if (parametersException.length === 1) {
            const pEX = parametersException[0]
            const localTell = _colorTell(this.settings[pEX])

            if (localTell) {
                _parameters.push(localTell)
                this.settings[localTell] = this.settings[pEX]
                _parameters.splice(_parameters.indexOf(pEX), 1)
            }
        }

        return [...new Set(_parameters)]
    }

    sanitizeFrom(settings) {
        // filter flags
        const parameters = this.sanitizeExceptionsFrom(Object.keys(settings))
        let output = false

        if (parameters.indexOf('grayscale') > -1 && typeof settings.grayscale === 'boolean' && parameters.length > 1) {
            parameters.splice(parameters.indexOf('grayscale'), 1)
        }

        if (parameters.length === 1 && _colorFactory.keys.indexOf(parameters[0]) > -1) {
            [output] = parameters
        } else if (parameters[0] === 'color') {
            const objectData = {}
            objectData.tell = _colorTell(objectData[parameters[0]])

            if (objectData.tell) {
                objectData[objectData.tell] = objectData.color
                if (objectData.tell === 'hex') {
                    output = _colorSanitizer.isHexVerbos(objectData.hex)
                } else {
                    output = objectData.tell
                }
            } else {
                this.error = 'Inputed color dose not math any color format'
            }
        } else {
            this.error = 'The color specified in from is not an accepted input'
        }
        return output
    }

    static validateLine(array) {
        const _this = []
        for (let a = 0; a < (array.length - 1); a++) {
            _this.push(Object.prototype.hasOwnProperty.call(_colorFactory[array[a]], array[a + 1]))
        }

        return (_this.indexOf(false) < 0)
    }

    static sanitizeExceptionsTo(to) {
        const listOfExceptions = {
            hex: 'hex6',
            android: 'hex8',
            decimal: 'rgbdecimal',
            web: 'hex3',
            websafe: 'hex3',
        }
        if (Object.prototype.hasOwnProperty.call(listOfExceptions, to)) {
            return listOfExceptions[to]
        }
        return to
    }

    sanitizeTo(from, to) {
        if (!this.error) {
            const _to = this.constructor.sanitizeExceptionsTo(to)

            // direct conversion
            if (Object.prototype.hasOwnProperty.call(_colorFactory[from], _to) || _to === from) {
                return [from, _to]
            }

            // actual color steps
            if (_colorFactory.keys.indexOf(_to) !== -1) {
                for (let i = 1; i < _colorFactory.paintKeys.length; i++) {
                    const stepsTable = _permutation(_colorFactory.paintKeys, from, _to, i)
                    for (let a = 0; a < stepsTable.length; a++) {
                        if (this.constructor.validateLine(stepsTable[a])) {
                            return stepsTable[a]
                        }
                    }
                }
            }

            this.error = 'The value you want to convert to is not acceptable'
        }

        return false
    }

    cleanUp() {
        const tempKeys = _removeFromArray(Object.keys(this), ['hexref', 'color'])

        if (this.error) {
            tempKeys.splice(tempKeys.indexOf('error'), 1)
        }

        if (this.debug !== true) {
            for (const i of tempKeys) {
                delete this[i]
            }
        }
    }

    ColorConvert(tempColor, to) {
        let _tempColor = tempColor
        if (!this.error && _tempColor && to) {
            // normal flow
            if (to[0] !== to[1]) {
                for (let i = 0; i < to.length - 1; i++) {
                    _tempColor = _colorFactory[to[i]][to[i + 1]](_clone(_tempColor))
                }
                // if the to and from are both hex return uppercase value
            } else if (['hex3', 'hex4', 'hex6', 'hex8'].indexOf(to[0]) > -1) {
                return _tempColor.toUpperCase()
            }
            // if to and from are both the same and not hex
            return _tempColor
        }
        this.error = this.error || 'Can`t convert color.'
        return {}
    }
}

module.exports = color
