module.exports = function copyObjectFix(ObjectToClone) {
    if (typeof ObjectToClone === 'object') {
        return JSON.parse(JSON.stringify(ObjectToClone).toLocaleLowerCase())
    }
    return ObjectToClone
}
