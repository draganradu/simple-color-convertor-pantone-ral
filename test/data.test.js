const testData = [
    [{hex6: '000000', to: 'hex3'}, '000' ],
    [{hex6: 'ffffff', to: 'hex3'}, 'FFF' ],
    [{hex: '#ffffcc', to: 'hex3'}, 'FFC' ],
    [{hex: '#caaa96', to: 'hex3'}, 'CA9' ],
    [{hex3: '#CA9', to: 'hex6'}, 'CCAA99' ],
    [{hex6: '#caaa96', to: 'hsl'}, { h: 23, s: 32.9, l: 69 } ],
    [{hex3: '#228', to: 'hex6'}, '222288' ],
    [{rgb: {r: 12, g:75, b:175}, to: 'ral'}, { ral: 'RAL 5017', name: 'Traffic blue' }],
    [{hex6: '000000', to: 'grayscale'}, 0 ],
    [{hex3: 'FFF', to: 'grayscale'}, 100 ],
    [{rgb: { r: 68, g: 255, b: 255 }, to: 'grayscale'}, 78 ],
    [{rgb: { r: 200, g: 0, b: 14 }, to: 'grayscale'}, 24 ],
    [{rgb: { r: 200, g: 0, b: 14 }, to: 'Notvaliddata'}, 'The value you want to convert to is not acceptable' ],
    [{hex3: '#228', to: 'hex6', grayscale: true}, '222222' ],
    [{hex3: '#228', to: 'hex6', grayscale: false}, '222288' ],
]

module.exports = testData;