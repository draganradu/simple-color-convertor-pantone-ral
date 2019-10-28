# Simple color converter Pantone Ral
It's as simple as install and use. Add the input to the correct data passed and the to the desired output and that is it.

![alt text](/assets/simple-color-convertor-pantone-ral.jpg)

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

#From
**input** is the argument used for the color you want to convert from.

| input     | output                        | type              | alt   |
| ---       | ---                           | ---               |       |
| cmyk      | { c: 0, m: 13, y: 77, k: 24 } | object / numbers  |       |
| grayscale | 78                            | integer           |       |
| hex       | '44FFFF'                      | string [6]        | hex6  |
| hex3      | '4ff'                         | string [3]        |       |
| hex3      | '#4ff'                        | string [4]        |       |
| hex6      | '44FFFF'                      | string [6]        | hex6  |
| rgb       | { r: 68, g: 255, b: 255 }     | object / numbers  |       |


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
| pantone   | '305-c'                                   | string [5]    |       |
| ral       | { ral: 'RAL 9010', name: 'Pure white' }   | object [2]    |       |
| rgb       | { r: 68, g: 255, b: 255 }                 | object [3]    |       |

#Flags
**flags** ar the arguments used for special modifiers.

| flag      | output            | data type     | note  |
| ---       | ---               | ---           | ---   |
| grayscale | grayscale value in the from format  | boolean       |       |

```javascript
const colorConverter = require('simple-color-converter');

var color = colorConverter({
    hex3: '#228', 
    to: 'cmyk', 
    grayscale: true 
})

console.log(color) // { c: 0, m: 0, y: 0, k: 87 }
```

#Errors
#####'The value you want to convert to is not acceptable' 
The *to* value is not in the accepted to, most of the times it is a misspelled value.

#####'The color specified in from is not an accepted input'
The *from* value is not in the accepted to, most of the times it is a misspelled value.


## Issues
1 | **grayscale** there are some issues when outputing ral/pantone colors, they output colors that are not completely monochrome. Because the closest color may be a colored gray. Will be fixed when we start useing HSL compare algoritham in 1.2.0