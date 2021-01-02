const SimpleColorConverter = require('../simple_color_converter')

const color = new SimpleColorConverter({ cmyk: [0, '13', 77, '24%'], to: 'grayscale', hexref: true })

console.log(color) // { c: 0, m: 53, y: 60, k: 60 }
