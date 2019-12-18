# list of exemples for Color key
If you use the color key instead of using a specific key for the from color there is a function called Tell in place that makes a series of assumptions to determine what is the color the input (string) contains.

| input         | determined color | sanitized | note |
| ---           | --- | --- | --- |
| 'fff'         | hex3 | '#fff' |
| '#fff'         | hex3 | '#fff' |
| 'hex fff'         | hex3 | '#fff' |
| 'ffffff'      | hex6 | '#ffffff' |
| '#ffffff'      | hex6 | '#ffffff' |
| 'hex ffffff'      | hex6 | '#ffffff' |
| '50'          | grayscale | {grayscale: 50} |
| 'grayscale 50'    | grayscale | {grayscale: 50} |
| 'rgb 0 50 8'      | RGB | {r: 0, g: 50, b: 8 } |
| 'r:0 g:50 b:8'    | RGB | {r: 0, g: 50, b: 8 } |
| 'cmyk 50 80 6 10' | CMYK | {c: 50, m: 80, y:6, k:10} |
| 'c: 50 m: 80 y: 6 k: 10' | CMYK | {c: 50, m: 80, y:6, k:10} |
| 'hsl 10 50 8'     | HSL | {h:10, s:50, l:8} |
| 'h:10 s:50 l:8'   | HSL | {h:10, s:50, l:8} |
| 'DarkSlateGray'   | HTML | darkslategray | kind of sensitive, accepts malforemed inputs but be carefull |
| 'darkslategray'       | HTML | darkslategray |  |
| 'Dark Slate Gray'     | HTML | darkslategray |  |
| 'dark slate gray'     | HTML | darkslategray |  |
