module.exports = function (ObjectToClone) {
    let temp = JSON.stringify(ObjectToClone)
    temp = temp.toLocaleLowerCase()
    return JSON.parse(temp)
}