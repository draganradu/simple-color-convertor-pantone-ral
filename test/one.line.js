

let simpleColorConverter = require('../simple_color_converter')

var color = new simpleColorConverter({
    ral: { ral: 3009 }, 
    to: 'cmyk'
})
 
console.log(color) // { c: 0, m: 53, y: 60, k: 60 } 