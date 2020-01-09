const cleaner = {
    hex: function(dirtyHex) {
        return dirtyHex.toLowerCase().replace(/[^a-f^0-9]/g,'')
    }
}
const identifier = {
    isGrayscale: function (rowData) {
        if (typeof rowData == "string" ||  typeof rowData == "number"){
            rowData = parseInt(rowData)
            if(isNaN(rowData) && Number.isInteger(rowData) && rowData >= 0 && rowData <= 100 ){
                return true
            }
        }
        return false
    },
    isHex(rowData) {
        if (typeof rowData === "string"){
            if(rowData.indexOf('#') > -1){
               return true     
            } else if (rowData.indexOf('.') == -1 && rowData.indexOf(',') == -1) {
                if (cleaner.hex(rowData).length === 3 || cleaner.hex(rowData).length === 6) {
                    return true
                }
            }
        }    
        return false
    },
    isRGBObject(rgb) {
        
    }
}


module.exports = function (rowData){
    let settings = {
        type: '',
        normalized: '',
    }
    
    if(identifier.isGrayscale(rowData)){
        // it is grayscale
        settings.type = 'grayscale'
        settings.normalized = Math.round(rowData)
    } else if (identifier.isHex(rowData)){
        settings.normalized = cleaner.hex(rowData)
        settings.type = (settings.normalized === 3 ) ? 'hex3' : 'hex6'
    }

    // is it hex?
}