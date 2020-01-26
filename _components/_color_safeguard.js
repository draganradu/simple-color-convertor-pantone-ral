const _removeFromArray = require('./frame/_remove_array_from_array')
// const AcceptedColors = require('./_accepted_colors')

function perfectMatch(color, match){
    return (color.indexOf(match) > -1)? true : false
}

function partialMatch(color, match){
    let temp = []
    for(let i of match){
        temp.push(perfectMatch(color,i))
    } 
    return temp.every(function(a){ return a === true })
}

function buildExclusionList(exclusionListColor, probableColor){
    let elementsToRemove = [probableColor, 'w']
    if(probableColor === 'rgba'){
        elementsToRemove.push('rgb')
    } else if (probableColor === 'hex'){
        elementsToRemove.push('hex3', 'hex4', 'hex6', 'hex8')
    }
    return  _removeFromArray(exclusionListColor, elementsToRemove)
}

module.exports = function (colorString, probableColor, exclusionListColor ) {
    if (!exclusionListColor) { return false }

    const exclusionList = buildExclusionList(exclusionListColor, probableColor)

    for(let i of exclusionList){
        if(['grayscale', 'hex', 'hex3', 'hex4', 'hex6', 'html', 'hex8', 'pantone', 'ral'].indexOf(i) > -1){
            // values that can be only perfect match
            if(perfectMatch(colorString, i)){ 
                return false 
            }
        } else  {
            // values that can be malforemd values
            if(partialMatch(colorString, i)){ 
                return false 
            }
        }
    }

    return true
}