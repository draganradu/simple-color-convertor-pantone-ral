'use strict'

module.exports = function (ObjectToClone) {
    if(typeof ObjectToClone === "object"){
        return JSON.parse(JSON.stringify(ObjectToClone).toLocaleLowerCase())
    } else {
        return ObjectToClone
    }
}