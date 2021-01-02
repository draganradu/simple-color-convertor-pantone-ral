module.exports = (listOfElements, listOfExclusion) => listOfElements.filter((x) => listOfExclusion.indexOf(x) < 0)
