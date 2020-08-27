'use strict'

module.exports = function(list,from,to, maxLen) {
    function noDuplicates(array) {
        return (new Set(array)).size === array.length
    }
    
    // Copy initial values as arrays
    const perm = list.map(function(val) {
        return [val]
    })
    // Our permutation generator
    const generate = function(_perm, _maxLen, currLen) {
        // Reached desired length
        if (currLen === _maxLen) {
            return _perm
        }
        // For each existing permutation
        for (let i = 0, len = _perm.length; i < len; i++) {
            const currPerm = _perm.shift()
            // Create new permutation
            for (let k = 0; k < list.length; k++) {
                const _temp = currPerm.concat(list[k])
                if (noDuplicates(_temp)){
                    _perm.push(_temp)
                }
            }
        }
        // Recurse
        return generate(_perm, _maxLen, currLen + 1)
    }

    // Start with size 1 because of initial values
    const temp = generate(perm, maxLen, 1)
    for (let a in temp){
        temp[a].unshift(from)
        temp[a].push(to)
    }
    return temp
}