'use strict'

module.exports = function(listOfElements,listOfExclusion) {
    return listOfElements.filter(function(x) { 
      return listOfExclusion.indexOf(x) < 0;
    })
}