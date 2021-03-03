module.exports = {
    _removeFromArray: (listOfElements:[], listOfExclusion:[]) => {
        return listOfElements.filter((x) => listOfExclusion.indexOf(x) < 0) },
    doubleString: (text:string) => {
        let _this = ''
        for (let index = 0; index < text.length; index++) {
            _this += text[index] + text[index]
        }
        return _this.toUpperCase()
    }    
}