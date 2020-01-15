![build passing](https://travis-ci.org/draganradu/simple-color-convertor-pantone-ral.svg?branch=master) ![License](https://img.shields.io/npm/l/simple-color-converter) ![maintained](https://img.shields.io/maintenance/yes/2019) ![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/simple-color-converter) 
![Node Version](https://img.shields.io/node/v/simple-color-converter) ![NPM](https://img.shields.io/npm/v/simple-color-converter) 
![size NPM](https://img.shields.io/bundlephobia/min/simple-color-converter)  ![size Git](https://img.shields.io/github/languages/code-size/draganradu/simple-color-convertor-pantone-ral) 
![Release](https://img.shields.io/github/release-date/draganradu/simple-color-convertor-pantone-ral)  ![Commit](https://img.shields.io/github/last-commit/draganradu/simple-color-convertor-pantone-ral) 
![Issues](https://img.shields.io/github/issues/draganradu/simple-color-convertor-pantone-ral) 
![Total downloads](https://img.shields.io/npm/dt/simple-color-converter) 


# Simple color converter for (almost) Any Color

[DEMO](https://draganradu.github.io/#/)

It covers most colors formats from Pantone, Ral, Hex 3/6/8, HTML, sRgb, Cmyk, etc for converting from -> and -< to. 
It's designed with simplicity in mind. you can pass data and specify the format or just let is guess what color you are tring to pass as string.

![simple color convertor logo](https://raw.githubusercontent.com/draganradu/simple-color-convertor-pantone-ral/master/assets/simple-color-convertor-pantone-ral.jpg)

## Install
```
$ npm install simple-color-converter
```
## Usage

```javascript
const simpleColorConverter = require('simple-color-converter');

var color = new simpleColorConverter({
    ral: { ral: 3009 }, 
    to: 'cmyk'
})

console.log(color) // { c: 0, m: 53, y: 60, k: 60 } 
```

# Supported colors

| color system      |  object   | array     | string |
| ---               |  ---      | ---       | ---    |
| cmyk              | {c: 39, m: 0, y: 39, k: 7} | [39, 0, 39.7] | 'cmyk 39 0 39 7'
| grayscale         |           |           | '78' |
| hex3              |           |           | '#9E9' |
| hex4              |           |           | '#9E9F' |
| hex6              |           |           | '#90EE90' |
| hex8              |           |           | '#90EE90FF' |
| html              |           |           | 'Light Green' |
| hsl               | { h: 120, s: 73.4, l: 74.9 } | [120, 73.4, 74.9] | 'hsl 120 73.4 74.9' |
| hsv               | { h: 120, s: 39.4, l: 93.3 } | [120, 39.4, 93.3] | 'hsl 120 39.4 93.3' |
| lab               |  {l: 86.5, a: -46.3, b: 36.9} | [86.5, -46.3, 36.9] | 'lab 86.5 -46.3 36.9' |
| pantone           | {name: '358C'} | | 'pantone 358C' |
| ral   | { ral : 6019 } | | 'ral 6019'|
| rgb | { r: 144, g: 238, b: 144 } | [144, 238, 144] | 'rgb 144 238 144'|
| rgba | { r: 144, g: 238, b: 144, a: 1 } | [144, 238, 144, 1] | 'rgba 144 238 144 1'|
| w | { r: 144, g: 238, b: 144, a: 1 } | [144, 238, 144, 1] | 'w 544' |
| xyz | { x: 44, g: 69, b: 45 } | [44, 69, 45] | 'xyz 44 69 45' |

# From
Any of the colors mentioned above. You can specify the color and it will be faster of just use the built in color detector.

```javascript

// faster
var fasterColor = new simpleColorConverter({
    rgb: {r: 10, g: 200, b: 50}, 
    to: 'cmyk'
})

// slower but more convenient

var slowerColor = new simpleColorConverter({
    color: 'rgb 10 200 50', 
    to: 'cmyk'
})

```

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

I`m Radu, Thank you for using my color convertor, I hope it is useful for you. I genuinely excited to build this kind of solutions.
