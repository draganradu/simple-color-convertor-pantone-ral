module.exports = function(list,from,to, maxLen) {
    function noDuplicates(array) {
        return (new Set(array)).size === array.length
    }

    // Copy initial values as arrays
    const perm = list.map(function(val) {
        return [val]
    })

    // Our permutation generator
    let generate = function(perm, maxLen, currLen) {
        // Reached desired length
        if (currLen === maxLen) {
            return perm
        }
        // For each existing permutation
        for (let i = 0, len = perm.length; i < len; i++) {
            let currPerm = perm.shift()
            // Create new permutation
            for (let k = 0; k < list.length; k++) {
                let temp = currPerm.concat(list[k])
                if (noDuplicates(temp)){
                    perm.push(temp)
                }
            }
        }
        // Recurse
        return generate(perm, maxLen, currLen + 1)
    }
    
    // Start with size 1 because of initial values
    let temp = generate(perm, maxLen, 1)
    for (let a in temp){
        temp[a].unshift(from)
        temp[a].push(to)
    }
    return temp
}