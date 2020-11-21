module.exports = {
    require(number1, number2) {
        if (number1 > 1 && number2 > 1) {
            return false
        }
        return true
    },
    fix(number) {
        return number * 100
    },
}
