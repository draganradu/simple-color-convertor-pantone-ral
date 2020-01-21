const colorConvertor = require("../simple_color_converter")

// const colorTest = new colorConvertor({
//     // hex6: '333333',
//     hex3: '333',
//     to: 'ral',
//     grayscale: false,
//     debug: true,
//     hexref: false
// });


var list = {
    color: "h 120;s 36;v:93", 
    to: 'hex3',
    hexref: true    
}

list.debug = true

const colorTest = new colorConvertor(list)
console.log(colorTest);
