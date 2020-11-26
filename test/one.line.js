const SimpleColorConverter = require('../simple_color_converter')

const color = new SimpleColorConverter({
    ral: { ral: 3009 },
    to: 'cmyk',
})

console.log(color) // { c: 0, m: 53, y: 60, k: 60 }
