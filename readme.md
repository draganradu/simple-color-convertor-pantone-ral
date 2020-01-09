![build passing](https://travis-ci.org/draganradu/simple-color-convertor-pantone-ral.svg?branch=master) ![License](https://img.shields.io/npm/l/simple-color-converter) ![maintained](https://img.shields.io/maintenance/yes/2019) ![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/simple-color-converter) 
![Node Version](https://img.shields.io/node/v/simple-color-converter) ![NPM](https://img.shields.io/npm/v/simple-color-converter) 
![size NPM](https://img.shields.io/bundlephobia/min/simple-color-converter)  ![size Git](https://img.shields.io/github/languages/code-size/draganradu/simple-color-convertor-pantone-ral) 
![Release](https://img.shields.io/github/release-date/draganradu/simple-color-convertor-pantone-ral)  ![Commit](https://img.shields.io/github/last-commit/draganradu/simple-color-convertor-pantone-ral) 
![Issues](https://img.shields.io/github/issues/draganradu/simple-color-convertor-pantone-ral) 
![Total downloads](https://img.shields.io/npm/dt/simple-color-converter) 


# Simple color converter Pantone Ral
V2 | It's as simple as install and use. Add the input to the correct data passed and the to the desired output and that is it.

![simple color convertor logo](https://raw.githubusercontent.com/draganradu/simple-color-convertor-pantone-ral/master/assets/simple-color-convertor-pantone-ral.jpg)

## Install
```
$ npm install simple-color-converter
```
## Usage

```javascript
const SimpleColorConverter = require('simple-color-converter');

var color = new SimpleColorConverter({
    ral: { ral: 3009, name: 'Oxide red', lrv: 5 }, 
    to: 'cmyk'
})

console.log(color) // { c: 0, m: 53, y: 60, k: 60 } 
```

# From
**input** is the argument used for the color you want to convert from. It supports a color key if you want to pass values directly from an input field, and i have a **tell** function that guesses the format.

| input     | output                                    | type              | alt   |
| ---       | ---                                       | ---               | ---   |
| **color** | 'FFF'                                     | string            | [see exemple plage](exemple_color.md)   |
| cmyk      | { c: 0, m: 13, y: 77, k: 24 }             | object / numbers  |       |
| grayscale | 78                                        | integer           |       |
| hex       | '44FFFF'                                  | string [6]        | auto detect if hex3 or hex6  |
| hex3      | '4ff'                                     | string [3]        |       |
| hex3      | '#4ff'                                    | string [4]        |       |
| hex6      | '44FFFF'                                  | string [6]        |       |
| hex8      | '44FFFF00'                                | string [8]        |       |
| hsl       | { h: 140, s: 39.7, l: 55.1 }              | object / numbers  |       |
| lab       | { l: 91, a: -44, b: -13 }                 | object [3]        |       | 
| ral       | {ral: { ral: 6004 }}
| rgb       | { r: 68, g: 255, b: 255 }                 | object / numbers  |       |
| rgba      | { r: 68, g: 255, b: 255, a: 0.5 }         | object / numbers        |       |
| w         | 480                                       | integer           | (experimental)|


# To 
**to** is the argument used to generate the correct outptut, all posible inputs are strings 

| to        | output                                    | data type     | alt   |
| ---       | ---                                       | ---           | ---   |
| cmyk      | { c: 75, m: 75, y: 0, k: 47 }             | object [4]    |       |
| grayscale | 78                                        | integer       |       |
| hex       | '44FFFF'                                  | string [6]    | hex6  |
| hex3      | '4FF'                                     | string [3]    |       |
| hex8      | '44FFFF00'                                | string [8]    |       |
| hsl       | { h: 140, s: 39.7, l: 55.1 }              | object [3]    |       |
| html      | 'DarkSlateGray'                           | string        |       | 
| lab       | { l: 91, a: -44, b: -13 }                 | object [3]    |       | 
| pantone   | '5477C'                                   | string [5]    |       |
| ral       | { ral: 9016, name: 'Traffic white', lrv: 87 }   | object [2]    |       |
| rgb       | { r: 68, g: 255, b: 255 }                 | object [3]    |       |
| rgba      | { r: 68, g: 255, b: 255, a: 0.5 }         | object [4]    |       |
| w         | 580                                       | integer       | wavelength is experimental |
| xyz       | { x: 68, y: 255, z: 255 }                 | object [3]    |       |

# Flags
**flags** are the arguments used for special modifiers. The most useful one is rendering grayscale color, but there is a debugger and a hexref flag created if you need to convert a color but also output a close hex similar color(in case of online color convertors).

```javascript
const simpleColorConverter = require('simple-color-converter');

var color = simpleColorConverter({
    hex3: '#228', 
    to: 'cmyk', 
    grayscale: true 
})

console.log(color) // { c: 0, m: 0, y: 0, k: 87 }
```

| flag      | output                                | data type     | default   | note  |
| ---       | ---                                   | ---           | ---       | ---   |
| grayscale | grayscale value in the from format    | boolean       | false          |       |
| hexref    | Reference value in hex format         | boolean       | false          | For Hex it equels Hex6 |
| debug     | this prevents the object cleanup      | boolean       | false          |       |


## Thank you

I`m Radu Thank you for using my color convertor, I hope it is useful for you. I genuinely excited to build this kind of solutions.
