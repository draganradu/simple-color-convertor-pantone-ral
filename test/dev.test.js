const colorConvertor = require("../simple_color_converter")

// const colorTest = new colorConvertor({
//     // hex6: '333333',
//     hex3: '333',
//     to: 'ral',
//     grayscale: false,
//     debug: true,
//     hexref: false
// });


var list = {color: 'r: 12, g: 75, b: 175, a: 0.1', to: 'rgb'}

list.debug = true

const colorTest = new colorConvertor(list)
console.log(colorTest);
