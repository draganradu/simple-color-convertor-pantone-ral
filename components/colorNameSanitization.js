module.exports = (colorName) => {
    const listOfName = {
        'hex3' :  'hex'
    }

    if (Object.keys(listOfName).indexOf(colorName) > -1){
        return listOfName[colorName]
    }

    return colorName
}