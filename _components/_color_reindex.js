module.exports = function (settingsColorString, settingsIndexColor, settingsRegexColorMatch){
    // stop if inposible due to legth
    if (settingsColorString.length < (settingsIndexColor.length + (settingsIndexColor.length -1))) { return false }
    // console.log(settingsColorString, settingsIndexColor, settingsRegexColorMatch)

    let tempIndex = [] 
    let tempString = []
    let tempOut = {}
    let regexColorMatch = new RegExp(settingsRegexColorMatch, 'g') || new RegExp('/(\d+)/', 'g')

    // perfect match
    if(settingsColorString.indexOf(settingsIndexColor) > -1) {
        tempOut = settingsColorString.match(regexColorMatch)
        if(tempOut.length === settingsIndexColor.length){
            return tempOut
        }
    } else {
        // index of interpolated match
        // build keys order
        for (i = 0; i < settingsIndexColor.length; i++) {
            tempString[settingsColorString.indexOf(settingsIndexColor[i])] = settingsIndexColor[i]
            tempIndex.push(settingsColorString.indexOf(settingsIndexColor[i]))
        }

        // cleanup and sort
        tempString = tempString.filter(function(e){ return e })
        
        if(tempString.length === settingsIndexColor.length){
            tempIndex.sort()

            // build object based on order
            for (i = 0; i < tempString.length; i++) {
                let start = settingsColorString.indexOf(tempString[i]) + 1 
                let end = settingsColorString.indexOf(tempString[i + 1])
                if (end < 0){ end = settingsColorString.length}
                
                // false match prevention
                let substring = settingsColorString.substring(start, end).match(regexColorMatch)
                if(substring){
                    tempOut[tempString[i]] = Number(substring[0])
                }
            }
        
            return tempOut 
        }
    }

    // build posible array from empty space
    if(settingsColorString.match(/[/, ]/g)){
        const arrayOfPosibleColors = settingsColorString.replace(/[/,]/g,' ').split(' ').filter(function(e){return e})
        return (arrayOfPosibleColors.length === settingsIndexColor.length) ? arrayOfPosibleColors : false
    }

    return false
}
