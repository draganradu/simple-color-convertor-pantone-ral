module.exports = function removeFromArray(listOfElements, listOfExclusion) {
    return listOfElements.filter((x) => listOfExclusion.indexOf(x) < 0)
}
