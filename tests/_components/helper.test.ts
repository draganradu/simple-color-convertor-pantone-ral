const helper = require('../../src/_components/helper');

describe('_removeFromArray', () => {
    test ('remove valid array from array', () => {
        const aArray = ['a','b','c']
        const bArray =  helper._removeFromArray(['a','b','c'], ['a'])
        expect(bArray.length).toBe(2)
    })
    
    test ('remove invalid array from array', () => {
        const aArray = ['a','b','c']
        const bArray =  helper._removeFromArray([], ['a'])
        expect(bArray.length).toBe(0)
    })
    
    test ('remove elements from array that dose not exist array', () => {
        const aArray = ['a','b','c']
        const bArray =  helper._removeFromArray(['b','c'], ['a'])
        expect(bArray.length).toBe(2)
    })
})

describe('doubleString', () => {
    test('turn F into FF',()=>{
        expect(helper.doubleString('F')).toEqual('FF')
    })
})