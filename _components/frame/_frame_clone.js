'use strict'
module.exports = function (ObjectToClone) {
    if(typeof ObjectToClone === "object"){
        let temp = JSON.stringify(ObjectToClone)
        temp = temp.toLocaleLowerCase()
        return JSON.parse(temp)
    } else {
        return ObjectToClone
    }
}