const colorConvertor = require("../simple_color_converter")

// const colorTest = new colorConvertor({
//     // hex6: '333333',
//     hex3: '333',
//     to: 'ral',
//     grayscale: false,
//     debug: true,
//     hexref: false
// });


constlist = {
    color: 'rgb 50 60 80', 
    to: 'rgb',
    hexref: true    
}

list.debug = true

const colorTest = new colorConvertor(list)
console.log(colorTest);
