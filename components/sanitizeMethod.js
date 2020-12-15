module.exports = ({ from, value }) => { 
    if(from.type === 'hex' ){
        return value.replace(/[^0-9a-f]/gi, '')
    }
    
    return false
}