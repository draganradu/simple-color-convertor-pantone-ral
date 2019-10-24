# Simple color converter Pantone Ral
It's as simple as install and use. Add the input to the correct data passed and the to the desired output and that is it.

## Install
```
$ npm install simple-color-converter
```
## Usage

```javascript
const colorConverter = require('simple-color-converter');

var color = colorConverter({
    hex3: '#4ff',
    to: 'ral'
})

console.log(color) // { ral: 'RAL 9010', name: 'Pure white' }
```

**to** is the argument used to generate the correct outptut, all posible inputs are strings 

| to        | output    | data type     | note  |
| ---       | ---       | ---           | ---   |
| hex       | '44FFFF'  | string [6]    | it defaults to hex6 |
| hex6      | '44FFFF'  | string [6]    |       |
| hex3      | '4FF'     | string [3]    |       |
| rgb       | { r: 68, g: 255, b: 255 }     | object [3] |       |
| hsl       | { h: 140, s: 39.7, l: 55.1 }  | object [3] |       |
|pantone    | '305-c'   | string [5]        |       |
| ral       | { ral: 'RAL 9010', name: 'Pure white' } | object [2] |       |
| grayscale | 78        | integer           |       |


**input** is the argument used for the correct input color.

| input | output    | type          |
| ---   | ---       | ---           |
| hex   | '44FFFF'  | string [6]    |
| hex6  | '#44FFFF' | string [7]    |
| hex3  | '4ff'     | string [3]    |
| hex3  | '#4ff'    | string [4]    |
| rgb   | { r: 68, g: 255, b: 255 } | object / numbers|


**flags** ar the arguments used for special modifiers.

| flag      | output            | data type     | note  |
| ---       | ---               | ---           | ---   |
| grayscale | grayscale value in the from format  | boolean       |       |


## Issues
1 | **grayscale** there are some issues when outputing ral/pantone colors, they output colors that are not compleaty monochrome.

## toDo
1 | CMYK convert From/To
2 | To color HTML
3 | From input Grayscale
4 | From input Ral
5 | From input Pantone