module.exports = function (colorString, indexColor, regexColorMatch){
    regexColorMatch = new RegExp(regexColorMatch) || new RegExp('-?\d+', 'g')
    let regex = new RegExp(`[^${indexColor}]`, 'g')
    let tempColor = colorString.replace(regex,'')

    if(tempColor.split('').sort().join('') === indexColor.split('').sort().join('')){
        let colorArray = colorString.match(regexColorMatch)  
        let tempArray = []
        for (let letter of indexColor){
            tempArray.push(colorArray[tempColor.indexOf(letter)])
        }
        
        return tempArray
    } else {
        return colorString.match(regexColorMatch) 
    }
}