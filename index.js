var acceptedColors = ['hex3','rgb']

const identifyMethod = require('./components/identifyMethod')
const sanitizeMethod = require('./components/sanitizeMethod')
const stringifyMethod = require('./components/stringifyMethod')
const convertMethod = require('./components/convert')

class SimpleColorConvertor {
    constructor(initSettings = {}){
        Object.defineProperty(this, '_color', {
            value: {},
            writable: true
        })

        Object.defineProperty(this, '_identify', {
            value: false,
            writable: true
        })

        for(const colorsName of acceptedColors) {
            // object value
            Object.defineProperty(this, `_${colorsName}`, {
                get () {
                    return this.convert({
                            from: this.identify,
                            to: colorsName,
                            value: this._color,
                        })
                },
            })

            // cache value
            Object.defineProperty(this, `cache_${colorsName}`, {
                value: '',
                writable: true
            })

            // string value
            Object.defineProperty(this, `${colorsName}`, {
                get () {
                    if(!this[`cache_${colorsName}`]) {
                        this[`cache_${colorsName}`] = this[`_${colorsName}`]
                    }
                    return this.stringify({
                        type: colorsName,
                        value: this[`cache_${colorsName}`]
                    })
                },
                set (value) {
                    this._identify = this.identifyMethod({ from: colorsName, value: value })
                    this._color = this.sanitize({
                        from: this._identify,
                        value: value, 
                    })
                    this.destroyCache()
                }
            })
        }
    }

    set color (value) {
        this._identify = this.identifyMethod({ from: '', value: value })
        this._color = this.sanitize({
            from: this._identify,
            value: value, 
        })
        this.destroyCache()
    }

    get color () {
        return this.stringify({
            value: this._color,
            type: this._identify.type
        })
    }

    get identify () {
        if(this._identify.type === 'hex') {
            return this._identify.type + this._identify.length
        }
        return false
    }

    destroyCache () {
        for(const colorsName of acceptedColors) {
            Object.defineProperty(this, `cache_${colorsName}`, {
                value: '',
                writable: true
            })
        }    
    } 

    identifyMethod ({ from, value }) {
        return identifyMethod({from, value})
    }

    stringify ({value, type}) {
        return stringifyMethod({value, type})
    }

    sanitize ({from, value}) {
        return sanitizeMethod({from, value})
    }

    convert ({from, to, value }) {
        return convertMethod({from, to, value})
    }


}
module.exports = SimpleColorConvertor