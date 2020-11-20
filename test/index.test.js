const dotColor = require('../simple_color_converter')
const testData = require('./test.data')


for(const rawTestColor of testData) {
    const inputColor = rawTestColor[0]
    const outputColor = rawTestColor[1]

    const testAppColor = new dotColor(inputColor)

    test(JSON.stringify(rawTestColor[0]) , () => {
            expect(testAppColor.color).toEqual(outputColor)
    })

    // testApp.color = i[0]
    // for ( const a in i[1]) {
    //     const t = testApp[a].toString() : testApp[a]
    //     const d = i[1][a]

    //     test([a,JSON.stringify(i[0]), JSON.stringify(t)].join(' | '), () => {
    //         expect(t).toEqual(d)
    //     })
    // }

}