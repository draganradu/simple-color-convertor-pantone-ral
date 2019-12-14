const colorConvertor = require("../simple_color_converter")

// const colorTest = new colorConvertor({
//     // hex6: '333333',
//     hex3: '333',
//     to: 'ral',
//     grayscale: false,
//     debug: true,
//     hexref: false
// });


var list = {ral: { ral: 3009, name: 'Oxide red', lrv: 5 }, to: 'cmyk'}

list.debug = true

const colorTest = new colorConvertor(list)
// console.log(colorTest);