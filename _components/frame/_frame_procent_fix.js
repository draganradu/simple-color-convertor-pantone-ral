module.exports = {
    requireProcentFix: function (number1, number2) {
        if(number1 > 1 && number2 > 1) {
            return false
        } else {
            return true
        }
    },
    procentFix: function (number) {
        return number * 100
    }
}