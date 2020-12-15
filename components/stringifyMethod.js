module.exports = ({value, type}) => {
    if(type) {
        if(type.indexOf('hex')> -1 ) {
            return `#${value}`
        }
    }
    
}