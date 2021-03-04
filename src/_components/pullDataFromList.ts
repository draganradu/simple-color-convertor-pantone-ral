module.exports =  (listName:[], coloType:string, reference:string, query:string = 'name'):any => {
    const _this = listName.filter((a) => a[query] === reference)
    return (_this.length) ? _this[0][coloType] : false
}
