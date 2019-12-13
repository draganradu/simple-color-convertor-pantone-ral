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
const simpleColorConverter = require('simple-color-converter');

var color = simpleColorConverter({
    hex: '#407ac2',
    to: 'ral'
})

console.log(color) // { ral: 5015, name: 'Sky blue', lrv: 17 }
```

#From
**input** is the argument used for the color you want to convert from. See altValues tab.

| input     | output                                    | type              | alt   |
| ---       | ---                                       | ---               | ---   |
| cmyk      | { c: 0, m: 13, y: 77, k: 24 }             | object / numbers  |       |
| grayscale | 78                                        | integer           |       |
| hex       | '44FFFF'                                  | string [6]        | auto detect if hex3 or hex6  |
| hex3      | '4ff'                                     | string [3]        |       |
| hex3      | '#4ff'                                    | string [4]        |       |
| hex6      | '44FFFF'                                  | string [6]        |       |
| hsl       | { h: 140, s: 39.7, l: 55.1 }              | object / numbers  |       |
| lab       | { l: 91, a: -44, b: -13 }                 | object [3]        |       | 
| rgb       | { r: 68, g: 255, b: 255 }                 | object / numbers  |       |
| w         | 480                                       | integer           | (experimental)|

#To 
**to** is the argument used to generate the correct outptut, all posible inputs are strings 

| to        | output                                    | data type     | alt   |
| ---       | ---                                       | ---           | ---   |
| cmyk      | { c: 75, m: 75, y: 0, k: 47 }             | object [4]    |       |
| grayscale | 78                                        | integer       |       |
| hex       | '44FFFF'                                  | string [6]    | hex6  |
| hex3      | '4FF'                                     | string [3]    |       |
| hsl       | { h: 140, s: 39.7, l: 55.1 }              | object [3]    |       |
| html      | 'DarkSlateGray'                           | string        |       | 
| lab       | { l: 91, a: -44, b: -13 }                 | object [3]    |       | 
| pantone   | '305-c'                                   | string [5]    |       |
| ral       | { ral: 'RAL 9010', name: 'Pure white' }   | object [2]    |       |
| rgb       | { r: 68, g: 255, b: 255 }                 | object [3]    |       |
| w         | 580                                       | integer       | wavelength is experimental |
| xyz       | { x: 68, y: 255, z: 255 }                 | object [3]    |       |

#Flags
**flags** ar the arguments used for special modifiers.

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
| hexref    | Reference value in hex format         | boolean       | false          | For Hex it equels Hex |

#Alt Values
After implementing the sanitzation function in 1.1.10 we have extended the accepted values. To help users that use this package on the frontend in conjuction with a input field. You can pass malformed data (lovely user inputed data as we call it) and we will sanitize it

##CMYK
We recomand passing an object containing 4 keys and the values are numbers.
	{ c: 0, m: 13, y: 77, k: 24 }
We can handle Arrays [0,'13',77,'24%'] ass well as String 'c: 0, m: 13, y: 77, k: 24' and '0, 13, 77, 24'    

#Error logs
#####'The value you want to convert to is not acceptable' 
The *to* value is not in the accepted to, most of the times it is a misspelled value.

#####'The color specified in from is not an accepted input'
The *from* value is not in the accepted to, most of the times it is a misspelled value.

#####'You can't get the wavelength of no color'
The color you want to convert is grayscale, logically there is no answer to what you want to do 

## Issues
1 | **grayscale** there are some issues when outputting ral/pantone colors, they output colors that are not completely monochrome. Because the closest color may be a colored gray. Will be fixed when we start using HSL compare algorithm in 1.2.0

2 | **wavelength** is experimental, it kind of works and i like the idea but the algorithm used is definitely not the correct one.
