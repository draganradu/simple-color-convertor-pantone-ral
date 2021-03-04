const AcceptedColors: any = require('../../src/_components/_accepted_colors')
const usableColors: any = new AcceptedColors()

const colorConvertor: {} = require('./convertColor')

describe('do colors have more then one color', () =>{

    for (const color of usableColors.keys) {
        test(`${color} has keys`, ()=> {
            expect(Object.keys(colorConvertor[color]).length).toBeGreaterThan(0)
        })
    }

})

