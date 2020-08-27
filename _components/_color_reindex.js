'use strict'

module.exports = function (settingsColorString, settingsIndexColor, settingsRegexColorMatch){
    // stop if inposible due to legth
    if (settingsColorString.length < (settingsIndexColor.length + (settingsIndexColor.length -1))) { return false }
    // console.log(settingsColorString, settingsIndexColor, settingsRegexColorMatch)

    const _this = {
        tempOut: {},
        regexColorMatch: new RegExp(settingsRegexColorMatch, 'g') || new RegExp('/(\d+)/', 'g'),

        get perfectMatch () {
            return settingsColorString.indexOf(settingsIndexColor) > -1
        },

        get partialMatch () {
            let requerdLetters = settingsIndexColor.length
            for (const i of settingsIndexColor) {
                if (settingsColorString.indexOf(i) > -1) {
                    requerdLetters --
                }
            }

            return requerdLetters == 0
        },


        get preventNoFormatReindex () {
            if(settingsIndexColor === 'hsl' ||  settingsIndexColor === 'hsv') {
                if(settingsColorString.indexOf('°') === -1){
                    return false
                }
            }
            return true
        }
    }
    
    if(_this.perfectMatch) {
        // perfect match
        _this.tempOut = settingsColorString.match(_this.regexColorMatch)
        if(_this.tempOut.length === settingsIndexColor.length){
            return _this.tempOut
        }
    } else if (_this.partialMatch){
        // partial - runs unorderd reindex
        for (const i of settingsIndexColor) {
            const colorIndex = settingsColorString.indexOf(i) + 1
            const match = settingsColorString.substring(colorIndex).match(_this.regexColorMatch)
            if(match){
                _this.tempOut[i] = match[0]
            }
        }
        
        return (_this.tempOut) ? _this.tempOut : false
    } else if (_this.preventNoFormatReindex) {
        // no match - orderd reindexing
        const match = settingsColorString.match(_this.regexColorMatch)
        if(match && match.length === settingsIndexColor.length){
            for (let i = 0; i < settingsIndexColor.length; i++) {
                _this.tempOut[settingsIndexColor[i]] = match[i]   
            }

            return _this.tempOut
        }
    }

    // // build posible array from empty space
    // if(settingsColorString.match(/[/, ]/g)){
    //     const arrayOfPosibleColors = settingsColorString.replace(/[/,]/g,' ').split(' ').filter(function(e){return e})
    //     return (arrayOfPosibleColors.length === settingsIndexColor.length) ? arrayOfPosibleColors : false
    // }

    return false
}
