'use strict'

// safeguard function is used to prevent string that contain ovious strings to be excluded

const AcceptedColors = require('./_accepted_colors')
// const _removeFromArray = require('./frame/_remove_array_from_array')

// function perfectMatch(color, match){
//     return (color.indexOf(match) > -1)? true : false
// }

// function partialMatch(color, match){
//     const temp = []
//     for(const i of match){
//         temp.push(perfectMatch(color,i))
//     } 
//     return temp.every(function(a){ return a === true })
// }

// function buildExclusionList(exclusionListColor, probableColor){
//     const elementsToRemove = [probableColor, 'w']
//     if(probableColor === 'rgba'){
//         elementsToRemove.push('rgb')
//     } else if (probableColor === 'hex'){
//         elementsToRemove.push('hex3', 'hex4', 'hex6', 'hex8')
//     }
//     return  _removeFromArray(exclusionListColor, elementsToRemove)
// }

// function fullMatch (string, color){
//     return (string.indexOf(color) > -1) 
// }

module.exports = function (colorString, probableColor) {
    if (typeof colorString !== 'string') { return false }

    const _this = {
        colorString: colorString,
        probableColor: probableColor,

        get acceptedColors () {
            return new AcceptedColors().keys.filter(a => a !== 'w').concat(['hex'])
        },

        fullMatch : function (i) {
            return (_this.colorString.indexOf(i) > -1)
        }
    }
    if(_this.fullMatch(_this.probableColor)){
        return true
    } else {
        for (const i of _this.acceptedColors) {
            if(_this.fullMatch(i)){
                return false
            }
        }
    }

    return true
}