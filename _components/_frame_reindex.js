module.exports = function (settingsColorString, settingsIndexColor, settingsRegexColorMatch){
    var tempColor = {}
    // full digit regex
    regexColorMatch = new RegExp(settingsRegexColorMatch, 'g') || new RegExp('/(\d+)/', 'g')

    // math regex
    let colorArray = settingsColorString.match(regexColorMatch) 
    
    // see / set if mathes lenght of color
    if (colorArray.length === settingsIndexColor.length ) {
        for(let i in colorArray){
            tempColor[settingsIndexColor[i]] = Number(colorArray[i])
        }
        return tempColor
    }
    
    return true
}