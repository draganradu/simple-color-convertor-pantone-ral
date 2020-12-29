
const colorNameSanitization = require('./colorNameSanitization.js')

function cleanupHex(stringToClean) {
    return stringToClean.replace(/[^0-9a-f]/gi, '')
}

const is = {
    hex: (value) => {
        const hexLength = cleanupHex(value).length
        const correctLength  = (hexLength === 3 || hexLength === 4 || hexLength === 6 || hexLength === 8 )
        if(value.indexOf('#') > -1 && correctLength){
            return {
                type: 'hex',
                length: hexLength
            }
        }
    },
    rgb: (value) => {
        
    }

}

module.exports = ({ from, value }) => {
    from = colorNameSanitization(from)
    if(from) {
        return is[from](value)
    }

    for (const checker of Object.keys(is)) {
        const checkerResult = is[checker](value) 
        if (checkerResult) {
            return checkerResult
        }
    }
    
    return value
}