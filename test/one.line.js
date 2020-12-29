const SimpleColorConverter = require('../index.js')

// const color = new SimpleColorConverter({
//     ral: { ral: 3009 },
//     to: 'cmyk',
// })

const color = new SimpleColorConverter()
color.color = '#123'

function log (a) {
    console.log(color[a], '|' ,a) 
}

// console.log(color._identify, '|', '_identify')
// console.log(color.identify, '|', 'identify') 
// console.log(color.color, '|', 'color') 
// console.log(color._color, '|', '_color') 


// console.log('-----------------------')

// console.log(color.hex3, '|', 'hex3'  )
// console.log(color._hex3, '|', '_hex3'  )

color.hex3 = '#999'


log('hex3')
log('_rgb')
log('rgb')