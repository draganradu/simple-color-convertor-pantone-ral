const _colorFactory   = require("./_components/_color_paint_factory")
const _colorSanitizer = require("./_components/_color_sanitizer")
const _colorTell      = require("./_components/_color_tell")
const _permutation    = require("./_components/_frame_permutation")

const _clone          = require("./_components/_frame_clone")

class color {
  constructor (settingsArg) {
    this.settings = _clone(settingsArg) || {}
    this.debug    = this.settings.debug || false 
    this.error    = ""
    
    this.settings  = this.sanitizeForHex(this.settings)
    this.grayscale = this.settings.grayscale || false

    this.from = this.sanitizeFrom(this.settings) || false
    this.to   = this.sanitizeTo(this.from, this.settings.to) || false

    this.extraStepsForGrayscale()
 
    this.color = (this.from && this.to) ? _colorSanitizer[this.from](this.settings[this.from]) : false

    this.color = this.ColorConvert(this.color, this.to)
    this.hexRefBuild()
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
        const stepsTemp = this.sanitizeTo(this.to[this.to.length - 1],'hex6') 
        this.hexref = this.ColorConvert(this.color, stepsTemp)
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

    console.log('X',parameters)
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

    if ( parameters.length === 1 && _colorFactory.hasOwnProperty(parameters[0]) ) {
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
      // steps conversion
      let tempPosibleColorMutations = Object.keys(_colorFactory)
      tempPosibleColorMutations = tempPosibleColorMutations.filter( keys => ['ral','pantone','grayscale'].indexOf(keys) === -1 )
      tempPosibleColorMutations = tempPosibleColorMutations.sort(function( x, y ) {  return x == "lab" ? -1 : y == "lab" ? 1 : 0; })

      // actual color steps 
      if (Object.keys(_colorFactory).indexOf(to) !== -1) {
        for(let i = 1; i < tempPosibleColorMutations.length; i++){
          let stepsTable = _permutation(tempPosibleColorMutations, from, to, i )
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

  cleanUp() {
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

  ColorConvert(tempColor, to) {
    if (!this.error && tempColor && to){
        if (to[0] !== to[1]){
          for(let i=0;i< to.length-1; i++ ){
              tempColor = _colorFactory[to[i]][to[i+1]](tempColor)
          }
        }
        return tempColor     
      }

      this.error = 'Can`t convert color.'
      return {}
  }
}

module.exports = color;