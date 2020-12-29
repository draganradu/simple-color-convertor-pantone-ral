const paintWorker = require('./paintFactory/paintWorker.js')
const mixingPaintSteps = require('./paintFactory/mixingSteps.js')

module.exports = ({ from, to, value }) => {
    if(from === to ) {
        return value
    }

    const recipeSteps = mixingPaintSteps({ from: from, to: to}) 

    if(recipeSteps) {
        for (let i = 0; i < recipeSteps.length - 1; i++) {
            const fromStep = recipeSteps[i]
            const toStep = recipeSteps[i + 1]
            value = paintWorker[fromStep][toStep](value)
        }

        return value
    }
    
    
    return "x"
} 