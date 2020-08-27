const _color_paint_factory = require('../_components/_color_paint_factory')
const _row_table = []



for (i in _color_paint_factory.keys) {
    _color_paint_factory.keys.push(_color_paint_factory.keys.shift())

    _row_table.push(_color_paint_factory.keys)
}

console.table(_row_table)

// console.table([['a','b'],['c','d']])