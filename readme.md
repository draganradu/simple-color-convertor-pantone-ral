# Simple color converter Pantone Ral
It's as simple as install and use. Add the input to the correct data passed and the to the desired output and that is it.

## Install
```
$ npm install simple-color-converter
```
## Usage

```javascript
const colorConverter = require('simple-color-convertor');

var color = colorConverter({
    hex3: '#4ff',
    to: 'ral'
})

console.log(color) // { ral: 'RAL 9010', name: 'Pure white' }
```

**to** is the argument used to generate the correct outptut, all posible inputs are strings 

| to    | output    | note  |
| ---   | ---       | ---   |
| hex   | '44fffff' | it defaults to hex6 |
| hex6  | '44fffff' |       |
| hex3  | '4ff'     |       |
| rgb   | { r: 68, g: 255, b: 255 }||
| HSL   | { h: 140, s: 39.7, l: 55.1 } ||
|pantone| 305-c ||
| ral   | { ral: 'RAL 9010', name: 'Pure white' } | |


**input** is the argument used for the correct input color.

| innput| output    | type      |
| ---   | ---       | ---       |
| hex   | '44fffff' | string    |
| hex6  | '#44fffff'| string    |
| hex3  | '4ff'     | string    |
| hex3  | '#4ff'    | string    |
| rgb   | { r: 68, g: 255, b: 255 }| object / numbers|
