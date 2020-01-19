const _colorFactory   = require("./_components/_color_paint_factory")
const _colorSanitizer = require("./_components/_color_sanitizer")
const _colorTell      = require("./_components/_color_tell")
const _permutation    = require("simple-color-converter/_components/frame/_frame_permutation")

const _clone          = require("simple-color-converter/_components/frame/_frame_clone")

class color {
  constructor (settingsArg = {}) {

    // get settings
    this.settings = this.sanitizeForHex(_clone(settingsArg))
    this.debug    = settingsArg.debug || false 
    this.error    = ""
    this.grayscale = this.settings.grayscale || false

    // set from and to
    this.from = this.sanitizeFrom(this.settings) || false
    this.to   = this.sanitizeTo(this.from, this.settings.to) || false
    
    // run extra work for flags
    this.extraStepsForGrayscale()
    
    // sanitize colors
    this.color = (this.from && this.to) ? _colorSanitizer[this.from](this.settings[this.from]) : false

    // convert
    this.color = this.ColorConvert(this.color, this.to)

    // build extra hex3 for 
    this.hexRefBuild()

    // build extra hex3 for 
    this.cleanUp()
  }

  extraStepsForGrayscale () {
    if (!this.error) {
      if (this.grayscale === true) {
        const LastColorStep = this.to.pop()
        let tempTo = [
            this.sanitizeTo(LastColorStep, "grayscale"),
            this.sanitizeTo("grayscale", LastColorStep),
        ]
        if (tempTo[0] && tempTo[1]) {
            tempTo[0].pop()
            this.to = this.to.concat(tempTo[0],tempTo[1])
        }
      }  
    }
  }

  hexRefBuild () {
      if (this.settings.hexref) { 
        const lastElement = this.to[this.to.length - 1]
        const stepsTemp = this.sanitizeTo(lastElement,'hex6') 

        if(lastElement === 'ral') {
          this.hexref = this.ColorConvert(_colorSanitizer[lastElement](this.color), stepsTemp)
        } else {
          this.hexref = this.ColorConvert(this.color, stepsTemp)
        }
        
        return true
      } 
      return false
  }

  sanitizeForHex(settings){
    if (settings.hasOwnProperty('hex') && _colorSanitizer.isHex(settings.hex)){
      settings['hex' + _colorSanitizer.isHex(settings.hex)] = settings.hex
      delete settings.hex
    }
    return settings
  }

  sanitizeExceptionsFrom(parameters) {
    // remove the elements that are not colors
    parameters = parameters.filter( from => ["to", "hexref", "debug" ].indexOf(from) === -1 )

    // Figure out wildcard colors
    const parametersException = parameters.filter( from => ['color','from'].indexOf(from) !== -1 )

    if(parametersException.length === 1){
      const pEX = parametersException[0] 
      const localTell = _colorTell(this.settings[pEX])

      if(localTell) {
        parameters.push(localTell)
        this.settings[localTell] = this.settings[pEX]
        parameters.splice(parameters.indexOf(pEX), 1)
      }
    }

    return [...new Set(parameters)]
  }

  sanitizeFrom(settings) {
    // filter flags
    
    let parameters = this.sanitizeExceptionsFrom(Object.keys(settings))
    
    if ( parameters.indexOf("grayscale") > -1 && typeof settings.grayscale === "boolean" &&  parameters.length > 1 ) {
      parameters.splice(parameters.indexOf("grayscale"), 1);
    }

    if ( parameters.length === 1 &&  _colorFactory.keys.indexOf(parameters[0]) > -1 ) {
      return parameters[0];
    } else if (parameters[0] === "color") {
      let objectData = {}
      objectData.tell = _colorTell(objectData[parameters[0]]);

      if (objectData.tell) {
        objectData[objectData.tell] = objectData.color;
        if (objectData.tell === "hex") {
          return _colorSanitizer.isHexVerbos(objectData.hex)
        }
        return objectData.tell;
      } else {
        this.error = "Inputed color dose not math any color format";
      }
    } else {
      this.error = "The color specified in from is not an accepted input";
      return false;
    }
  }

  stepsToConvert(from, to, ColorLang) {
    return (
      _colorFactory[from].hasOwnProperty(ColorLang) &&
      _colorFactory[ColorLang].hasOwnProperty(to)
    );
  }

  validateLine(array) {
    let temp = []
    for(let a = 0; a < (array.length -1); a++){
      temp.push(_colorFactory[array[a]].hasOwnProperty(array[a+1]))
    }
    
    return (temp.indexOf(false) === -1 )
  }

  sanitizeExceptionsTo(to){
    var listOfExceptions = {
      hex: 'hex6',
    }
    if(listOfExceptions.hasOwnProperty(to)){
      return listOfExceptions[to]
    } 
    return to
  }

  toException(to){
    var exceptionList = {
      hex: 'hex6',
    };

    if(exceptionList.hasOwnProperty(to)){
      return exceptionList[to]
    } 
    return to;
  }

  sanitizeTo(from, to) {
    if (!this.error) {

      to = this.sanitizeExceptionsTo(to)

      // direct conversion
      if (_colorFactory[from].hasOwnProperty(to) || to === from) {
        return [from, to];
      }

      // actual color steps 
      if ( _colorFactory.keys.indexOf(to) !== -1) {
        for(let i = 1; i < _colorFactory.keysFilterd.length; i++){
          let stepsTable = _permutation(_colorFactory.keysFilterd, from, to, i )
          for (let a = 0; a < stepsTable.length; a++){
            if( this.validateLine(stepsTable[a]) ){
              return stepsTable[a]
            }
          }
        }
      }

      this.error = "The value you want to convert to is not acceptable" ;
    }

    return false;
  }

  cleanUp () {
    let tempKeys = Object.keys(this).filter(exception => ['hexref','color'].indexOf(exception) === -1);

    if (this.error) {
      tempKeys.splice(tempKeys.indexOf("error"), 1);
    } 

    if(this.debug !== true){
      for (let i of tempKeys) {
        delete this[i];
      }
    }
  }

  ColorConvert (tempColor, to) {
    if (!this.error && tempColor && to){
        // normal flow
        if (to[0] !== to[1]){
          for(var i= 0; i< to.length-1; i++ ){
              tempColor = _colorFactory[to[i]][to[i+1]](_clone(tempColor))
          }
        // if the to and from are both hex return uppercase value  
        } else if (['hex3','hex4','hex6','hex8'].indexOf(to[0]) > -1) {
          return tempColor.toUpperCase()
        }
        // if to and from are both the same and not hex
        return tempColor     
      }
      this.error = this.error || 'Can`t convert color.'
      return {}
  }
}

module.exports = color;