module.exports = {
    requireProcentFix: function (number1, number2) {
        return !(number1 > 1 && number2 > 1)
    },
    procentFix: function (number) {
        return number * 100
    }
}