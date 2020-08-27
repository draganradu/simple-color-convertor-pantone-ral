'use strict'
module.exports = function (settingsColorString, settingsIndexColor, settingsRegexColorMatch, letters) {
    // stop if inposible due to legth
    if (settingsColorString.length < (settingsIndexColor.length + (settingsIndexColor.length -1))) { return false }

    function partialIndexMatch (colorString,ColorName, exclusionlettersPattern) {
        
        function indexOfColorName (colorString, ColorName) {
            for (const i of ColorName) {
                if(colorString.indexOf(i) > -1){
                    return true
                }
            }
            return false
        }

        function indexOfExclusionPattern (colorString, exclusionlettersPattern) {
            for (const i of exclusionlettersPattern) {
                if(colorString.indexOf(i) > -1){
                    return true
                }
            }
            return false
        }

        exclusionlettersPattern = letters.filter(i => ColorName.split("").indexOf(i) === -1);
        const patternResult = (indexOfColorName(colorString, ColorName) === true && indexOfExclusionPattern(colorString, exclusionlettersPattern) === false )
        const letterLess = true
        return letterLess ? true : (pattern)
    }

    function correctColorPosition (colorString, fallback) {
        const stringposition = colorString.replace(/[^a-z]/gi,'');
        return stringposition ? stringposition.split('') : fallback.split('')
    }

    const tempColor = {}
    // full digit regex
    const regexColorMatch = new RegExp(settingsRegexColorMatch, 'g') || new RegExp('/(\d+)/', 'g')

    // math regex
    let colorArray = settingsColorString.match(regexColorMatch)
    
    // see / set if mathes lenght of color
    if (colorArray && settingsIndexColor && colorArray.length === settingsIndexColor.length) {
        if(settingsIndexColor === 'rgb' || settingsIndexColor === 'rgba' || partialIndexMatch(settingsColorString, settingsIndexColor, letters)){
            // get the corect order of keys from the colors
            const indexAcuratColorPosition = correctColorPosition(settingsColorString, settingsIndexColor)

            // build object based on order
            for (let i in colorArray) {
                tempColor[indexAcuratColorPosition[i]] = Number(colorArray[i])
            }
        }
        
        return tempColor
    }

    return true
}