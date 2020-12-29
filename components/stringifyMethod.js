module.exports = ({value, type}) => {
    if(type) {
        if(type.indexOf('hex')> -1 ) {
            return `#${value}`
        }
    }
    
    if(typeof value === 'object') {
        const colorName = Object.keys(value).join('').toUpperCase()
        const colorValue = Object.values(value).join(', ')
        return `${colorName}(${colorValue})`
    }
}