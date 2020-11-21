

const dotColor = require('../simple_color_converter')
const testData = require('./test.data')


for(const rawTestColor of testData) {
    const inputColor = rawTestColor[0]
    const outputColor = rawTestColor[1]

    const testAppColor = new dotColor(inputColor)

    test(JSON.stringify(rawTestColor[0]) , () => {
            expect(testAppColor.color).toEqual(outputColor)
    })
}