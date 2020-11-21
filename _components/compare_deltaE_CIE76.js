module.exports = function compareColor(lab1, lab2) {
    return Math.sqrt(((lab1.l - lab2.l) ** 2) + ((lab1.a - lab2.a) ** 2) + ((lab1.b - lab2.b) ** 2))
}
