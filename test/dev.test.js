const colorConvertor = require("../simple_color_converter")

// const colorTest = new colorConvertor({
//     // hex6: '333333',
//     hex3: '333',
//     to: 'ral',
//     grayscale: false,
//     debug: true,
//     hexref: false
// });


const colorTest = new colorConvertor({hex3: '#228', to: 'rgb', grayscale: true, debug: true})
console.log(colorTest);