module.exports = {
    cloneAndFormat: (ObjectToClone) => {
        if (typeof ObjectToClone === 'object') {
            return JSON.parse(JSON.stringify(ObjectToClone).toLocaleLowerCase())
        }
        return ObjectToClone
    },
    cloneData: (data) => {
        if (typeof data === 'object' && !Array.isArray(data)) {
            return { ...data }
        }
        return data
    },

}
