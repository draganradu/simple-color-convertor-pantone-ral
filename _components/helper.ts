module.exports = {
    _removeFromArray: (listOfElements:[], listOfExclusion:[]) => {
        return listOfElements.filter((x) => listOfExclusion.indexOf(x) < 0) },
}