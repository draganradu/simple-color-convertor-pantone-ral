const testData = [
    [{hex6: '000000', to: 'hex3'}, '000' ],
    [{hex6: 'ffffff', to: 'hex3'}, 'FFF' ],
    [{hex: '#ffffcc', to: 'hex3'}, 'FFC' ],
    [{hex: '#caaa96', to: 'hex3'}, 'CA9' ],
    [{hex3: '#CA9', to: 'hex6'}, 'CCAA99' ],
    [{hex6: '#caaa96', to: 'hsl'}, { h: 23, s: 32.9, l: 69 } ],
    [{hex3: '#228', to: 'hex6'}, '222288' ],
    [{rgb: {r: 12, g:75, b:175}, to: 'ral'}, { ral: 5002, name: 'Ultramarine blue', lrv: 4 }],
    [{hex6: '000000', to: 'grayscale'}, 0 ],
    [{hex3: 'FFF', to: 'grayscale'}, 100 ],
    [{rgb: { r: 68, g: 255, b: 255 }, to: 'grayscale'}, 78 ],
    [{rgb: { r: 200, g: 0, b: 14 }, to: 'grayscale'}, 24 ],
    [{rgb: { r: 200, g: 0, b: 14 }, to: 'Notvaliddata'}, {error: 'The value you want to convert to is not acceptable'} ],
    // [{hex3: '#228', to: 'hex6', grayscale: true}, '222222' ],
    [{hex3: '#228', to: 'hex6', grayscale: false}, '222288' ],
    [{rgb: {r: 23, g: 145, b: 125}, to: 'hex6', grayscale: true}, '696969' ],
    [{rgbx: {r: 23, g: 145, b: 125}, to: 'hex6', grayscale: true}, {error: 'The color specified in from is not an accepted input'} ],
    [{to: 'hex6', grayscale: true}, {error: 'The color specified in from is not an accepted input'} ],
    [{rgbx: {r: 23, g: 145, b: 125}, grayscale: true}, {error: 'The color specified in from is not an accepted input'} ],
    [{grayscale: true}, {error: 'The color specified in from is not an accepted input'} ],
    [{}, {error: 'The color specified in from is not an accepted input'} ],
    [{rgb: { r: 255, g: 255, b: 255 }, to: 'cmyk'}, { c: 0, m: 0, y: 0, k: 0 } ],
    [{rgb: { r: 0, g: 0, b: 0 }, to: 'cmyk'}, { c: 0, m: 0, y: 0, k: 100 } ],
    [{rgb: { r: 255, g: 0, b: 0 }, to: 'cmyk'}, { c: 0, m: 100, y: 100, k: 0 } ],
    [{rgb: { r: 73, g: 42, b: 200 }, to: 'cmyk'}, { c: 64, m: 79, y: 0, k: 22 } ],
    [{hex6: '#caaa96', to: 'cmyk'}, { c: 0, m: 16, y: 26, k: 21 } ],
    [{hex3: '#228', to: 'cmyk'}, { c: 75, m: 75, y: 0, k: 47 } ],
    // [{hex3: '#228', to: 'cmyk', grayscale: true }, { c: 0, m: 0, y: 0, k: 87 } ],
    [{cmyk: { c: 0, m: 16, y: 26, k: 21 }, to: 'hex6'}, 'C9A995' ],
    [{cmyk: { c: 0, m: 16, y: 26, k: 21 }, to: 'rgb'}, { r: 201, g: 169, b: 149 } ],
    [{cmyk: { c: 0, m: 0, y: 0, k: 0 }, to: 'hex3'}, 'FFF' ],
    [{cmyk: { c: 0, m: 13, y: 77, k: 24 }, to: 'hsl'}, { h: 50, s: 62.3, l: 46.9 } ],
    [{cmyk: { c: 0, m: 13, y: 77, k: 24 }, to: 'pantone'}, '103C' ],
    [{cmyk: { c: 0, m: 13, y: 77, k: 24 }, to: 'ral'}, { ral: 1012, name: 'Lemon yellow', lrv: 46 } ],
    [{cmyk: { c: 0, m: 13, y: 77, k: 24 }, to: 'grayscale'}, 64 ],
    [{rgb: { r: 73, g: 42, b: 200 }, to: 'html'}, 'DarkSlateBlue' ],
    [{rgb: { r: 0, g: 0, b: 0 }, to: 'html'}, 'Black' ],
    [{hex3: '#fff', to: 'html'}, 'White' ],
    [{hex: '#782e1c', to: 'html'}, 'SaddleBrown' ],
    [{hex6: '#782e1c', to: 'html', grayscale: true }, 'DarkSlateGray' ],
    [{grayscale: 100, to: 'rgb' }, { r: 255, g: 255, b: 255 } ],
    [{grayscale: 0, to: 'rgb' }, { r: 0, g: 0, b: 0 } ],
    [{grayscale: 28, to: 'cmyk' }, {c: 0, m: 0, y: 0, k: 28} ],
    [{grayscale: 48, to: 'hex3' }, '777' ],
    [{grayscale: 48, to: 'hex6' }, '7A7A7A' ],
    [{grayscale: 48, to: 'hsl' }, { h: 0, s: 0, l: 47.8 } ],
    [{grayscale: 48, to: 'html' }, 'Gray' ],
    [{grayscale: 48, to: 'pantone' }, '424C' ],
    [{grayscale: 48, to: 'ral' },  { ral: 9023, name: 'Pearl dark grey', lrv: 0 }],
    [{rgb: { r: 73, g: 42, b: 200 }, to: 'hsl'}, { h: 252, s: 65.3, l: 47.5 } ],
    [{hsl: { h: 252, s: 65.3, l: 47.5 }, to: 'rgb'}, { r: 74, g: 42, b: 200 } ],
    [{hsl: { h: 252, s: 65.3, l: 47.5 }, to: 'hex'}, '4A2AC8' ],
    [{hsl: { h: 252, s: 65.3, l: 47.5 }, to: 'hex3'}, '42C' ],
    [{hsl: { h: 252, s: 65.3, l: 47.5 }, to: 'grayscale'}, 27 ],
    [{hsl: { h: 252, s: 65.3, l: 47.5 }, to: 'cmyk'}, { c: 63, m: 79, y: 0, k: 22 }],
    [{hsl: { h: 252, s: 65.3, l: 47.5 }, to: 'html'}, 'DarkSlateBlue'],
    [{hsl: { h: 252, s: 65.3, l: 47.5 }, to: 'pantone'}, '5477C'],
    [{hsl: { h: 252, s: 65.3, l: 47.5 }, to: 'ral'}, { ral: 6012, name: 'Black green', lrv: 4 }],
    [{hsl: { h: 252, s: 65.3, l: 47.5 }, to: 'xyz'}, { x: 13.368374737598952, y: 7.281656155992719, z: 67.83013086408046 }],
    [{rgb: { r: 123, g: 11, b: 6 }, to: 'xyz'}, { x: 7.902365454434076, y: 4.464207465989184, z: 0.7307758840066325 } ],
    [{hex6: '#782e1c', to: 'xyz'}, { x: 8.4829815289864, y: 6.031538314637167, z: 2.1982922041759108 } ],
    [{hex3: '#fff', to: 'xyz'}, { x: 90.2667003039493, y: 99.9999999999993, z: 133.55986443768907 } ],
    [{hsl: { h:0, s: 100, l: 50 } , to: 'w'}, 620 ],
    [{rgb: { r: 123, g: 11, b: 6 }, to: 'hsl'}, {h: 3, s: 90.7, l: 25.3}],
    [{hsl: {h: 3, s: 90.7, l: 25.3} , to: 'w'}, 618 ],
    [{hsl: {h: 136, s: 79, l: 49} , to: 'w'}, 534 ],
    // [{from: '50' , to: 'html', grayscale: true }, 'DarkSlateGray' ],
    // [{from: 50 , to: 'html', grayscale: true }, 'DarkSlateGray' ],
    // [{from: '#000' , to: 'html', grayscale: true }, 'DarkSlateGray' ],
    // [{from: '#34c9eb' , to: 'html', grayscale: true }, 'DarkSlateGray' ],
    // [{from: '3aa174' , to: 'html', grayscale: true }, 'DarkSlateGray' ],
    // [{from: '3aa174' , to: 'html', grayscale: true }, 'DarkSlateGray' ],
    [{cmyk: { c: 0, m: 16, y: 26, k: 21 }, to: 'grayscale'}, 69 ],
    [{rgb: { r: 255, g: 255, b: 255 }, to: 'lab'}, { l: 100, a: 0.00526049995830391, b: -0.010408184525267927 } ],
    [{rgb: { r: 15, g: 90, b: 255 }, to: 'lab'}, { l: 45.12861454425882, a: 43.058600125026935, b: -86.56944359422826 } ],
    [{cmyk: { c: 0, m: 16, y: 26, k: 21 }, to: 'lab'}, { l: 71.53010051959498, a: 8.624104406451282, b: 14.666827321954369 } ],
    [{hsl: {h: 136, s: 79, l: 49} , to: 'lab'}, { l: 78.51734776675912, a: -72.7687053381565, b: 56.68550402015393 }],
    [{grayscale: 48, to: 'lab' }, { l: 51.22315087944811, a: 0.0030485119172363184, b: -0.006031646195903129 }],
    [{hex3: '#4ff', to: 'lab' }, { l: 91.67092446660901, a: -44.449115142936925, b: -13.251356348939769 }],
    [{lab: { l: 51.22315087944811, a: 0.0030485119172363184, b: -0.006031646195903129 }, to: 'rgb' }, { r: 122, g: 122, b: 122 }],
    [{lab: { l: 91.6709, a: -44.4490, b: -13.2514 }, to: 'rgb' }, { r: 68, g: 255, b: 255 }],
    [{lab: { l: 91.6709, a: -44.4490, b: -13.2514 }, to: 'cmyk' }, { c: 73, m: 0, y: 0, k: 0 }],
    [{lab: { l: 91.6709, a: -44.4490, b: -13.2514 }, to: 'grayscale' }, 78],
    [{lab: { l: 91.6709, a: -44.4490, b: -13.2514 }, to: 'hex' }, '44FFFF'],
    [{lab: { l: 91.6709, a: -44.4490, b: -13.2514 }, to: 'pantone' }, '337C'],
    [{rgb: { r: 245, g: 236, b: 98 }, to: 'lab' }, { l: 91.81268569245218, a: -13.48575904576782, b: 66.1373345943654 }],
    [{hex: '#e30e3f', to: 'html' }, 'Crimson' ],
    [{hex: '#51e30e', to: 'html' }, 'LawnGreen' ],
    [{hex: '#51e30e', to: 'ral' }, { ral: 1013, name: 'Oyster white', lrv: 70 } ],
    [{rgb: {r: 10, g: 10, b: 128}, to: 'hex' }, '0A0A80' ],
    [{hex6: '#0A0A80', to: 'rgb' }, {r: 10, g: 10, b: 128} ],
    [{hex: '#4ff', to: 'lab' }, { l: 91.67092446660901, a: -44.449115142936925, b: -13.251356348939769 }],
    [{hex: '#fff', to: 'html'}, 'White' ],
    [{hex: 'fff', to: 'html'}, 'White' ],
    [{hex: 'fff', to: 'rgb', hexref: true }, { r: 255, g: 255, b: 255, hexref: '#FFFFFF' } ],
    [{cmyk: { c: 0, m: 16, y: 26, k: 21 }, to: 'grayscale' , hexref: true}, { grayscale: 69, hexref: '#B0B0B0' }],
    [{cmyk: { c: 0, m: 16, y: 26, k: 21 }, to: 'hex3' , hexref: true}, { hex3: 'CA9', hexref: '#CCAA99' }],
    [{cmyk: { c: 0, m: 16, y: 26, k: 21 }, to: 'hex6' , hexref: true}, { hex6: 'C9A995', hexref: '#C9A995' }],
    [{cmyk: { c: 0, m: 16, y: 26, k: 21 }, to: 'hex' , hexref: true}, { hex6: 'C9A995', hexref: '#C9A995' }],
    [{cmyk: { c: 0, m: 16, y: 26, k: 21 }, to: 'hsl' , hexref: true}, { h: 23, s: 32.5, l: 68.6, hexref: '#C9A995' }],
    [{cmyk: { c: 0, m: 16, y: 26, k: 50 }, to: 'lab' , hexref: true}, { l: 46.85979292051761, a: 6.162165941153541, b: 10.383092340634247, hexref: '#806B5E' }],
    [{cmyk: { c: 0, m: 16, y: 26, k: 21 }, to: 'html', hexref: true }, { html: 'Tan', hexref: '#D2B48C' }],
    [{cmyk: { c: 0, m: 16, y: 26, k: 21 }, to: 'pantone', hexref: true }, { pantone: '480C', hexref: '#C6A992' }],
    [{cmyk: { c: 0, m: 16, y: 26, k: 21 }, to: 'ral', hexref: true }, { ral: 1019, name: 'Grey beige', lrv: 29, hexref: '#A28F7A' }],
    [{cmyk: { c: 0, m: 16, y: 26, k: 21 }, to: 'rgb', hexref: true }, { r: 201, g: 169, b: 149, hexref: '#C9A995' }],
    [{cmyk: { c: 0, m: 16, y: 26, k: 21 }, to: 'w', hexref: true }, { w: 606, hexref: false }],
    [{cmyk: { c: 0, m: 16, y: 26, k: 21 }, to: 'xyz', hexref: true }, { x: 41.50128278151833, y: 42.96417206697969, z: 42.21916240998438, hexref: false }],
    [{rgb: { r: 200, g: 0, b: 14 }, to: 'ral'}, { ral: 3020, name: 'Traffic red', lrv: 12 } ],
    [{w: 600, to: 'rgb'}, { r: 255, g: 177, b: 0 } ],
    [{w: 300, to: 'rgb'}, { r: 0, g: 0, b: 0 } ],
    [{w: 15000, to: 'rgb'}, { r: 0, g: 0, b: 0 } ],
    [{w: 480, to: 'rgb'}, { r: 0, g: 204, b: 255 } ],
    [{w: 480, to: 'cmyk'}, { c: 100, m: 20, y: 0, k: 0 } ],
    [{w: 480, to: 'grayscale'}, 58 ],
    [{w: 480, to: 'hex'}, '00CCFF' ],
    [{w: 480, to: 'hex6'}, '00CCFF' ],
    [{w: 480, to: 'hex3'}, '0CF' ],
    [{w: 480, to: 'hsl'}, { h: 192, s: 100, l: 50 } ],
    [{w: 480, to: 'html'}, 'DeepSkyBlue' ],
    [{w: 480, to: 'xyz'}, { x: 37.64689970481482, y: 50.40307154937514, z: 125.39799504017896 } ],
    [{hex: 'fff', to: 'html', grayscale: true }, 'White' ],
    [{hex: 'ff0', to: 'html', grayscale: true, hexref: true }, { html: 'Gainsboro', hexref: '#DCDCDC' } ],
    [{hex: '76D7D6', to: 'xyz', grayscale: true }, { x: 44.32283189620506, y: 49.10208498478322, z: 65.58067814175581 } ],
    [{hex: '76D7D6', to: 'pantone' }, '3242C' ],
    [{hex: '76D7D6', to: 'pantone', grayscale: true }, '421C' ],
    [{hex: '#f54275', to: 'pantone', grayscale: true }, '424C' ],
    [{w: 480, to: 'hex3', grayscale: true }, '999' ],
    [{hex: '76D7D6', to: 'w', grayscale: true }, { error: 'You can`t get the wavelength of no color' } ],
    [{hex: '407ac2', to: 'ral'}, { ral: 5015, name: 'Sky blue', lrv: 17 } ],
]

module.exports = testData;