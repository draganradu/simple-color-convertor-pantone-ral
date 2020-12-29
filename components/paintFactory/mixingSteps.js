const paintWorker = require('./paintWorker.js')

module.exports = ({from, to}) => {
    if (from === to) {
        return false
    }

    const app = {
        count: 0,
        maxSteps: 5,
        maxCount: Math.pow(Object.keys(paintWorker).length, 2),
        tempArray: [],
    }

    const recursive = (a) => {
        if (a.length > 1 && a[a.length - 1] === to) {
            app.tempArray.push(a)
        }

        if (app.count++ >= app.maxCount) {
            return true
        }

        if (a.length < app.maxSteps) {
            for (const b of Object.keys(paintWorker[a[a.length - 1]])) {
                if (a.indexOf(b) === -1) {
                    recursive(a.concat(b))
                }
            }
        }
    }

    recursive([from])

    app.tempArray.sort((a, b) => {
        return a.length - b.length
    })

    return app.tempArray[0]
}