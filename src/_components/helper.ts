module.exports = {
    _removeFromArray: (listOfElements:[], listOfExclusion:[]) => {
        return listOfElements.filter((x) => listOfExclusion.indexOf(x) < 0) 
    },

    doubleString: (text:string) => {
        let _this = ''
        for (let index = 0; index < text.length; index++) {
            _this += text[index] + text[index]
        }
        return _this.toUpperCase()
    },
    
    approxFix: (colorObject:any) => {
        // fix rounding error in old versions os Node
        const _this = { ...colorObject }
        for (const i in _this) {
            if (Object.prototype.hasOwnProperty.call(_this, i)) {
                _this[i] = (Math.round(_this[i] * 1000000000) / 1000000000)
            }
        }
    
        return _this
    },

    splitCamelCase: (name:string):string => {
        return name.replace(/([A-Z])/g, ' $1').trim()
    }
}