'use strict'

module.exports = {
    require: function (number1, number2) {
        if(number1 > 1 && number2 > 1) {
            return false
        } else {
            return true
        }
    },
    fix: function (number) {
        return number * 100
    }
}