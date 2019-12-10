const _colorFactory = require("./_components/_color_paint_factory");
const _colorSanitizer = require("./_components/_color_sanitizer");
const _colorTell = require("./_components/_color_tell");
const _permutation = require("./_components/_frame_permutation")

const _clone = require("./_components/_frame_clone")

class color {
  constructor(settingsArg) {
    this.settings = _clone(settingsArg) || {};
    this.debug = this.settings.debug || false ;
    this.error = "";
    
    this.settings = this.sanitizeForHex(this.settings)
    this.grayscale = this.settings.grayscale || false;

    this.from = this.sanitizeFrom(this.settings) || false;
    this.to = this.sanitizeTo(this.from, this.settings.to) || false;

    this.extraStepsForGrayscale()
 
    this.color = (this.from && this.to)? _colorSanitizer[this.from](this.settings[this.from]) : false;

    this.color = this.ColorConvert(this.color, this.to);
    this.HexRefBuild();
    this.cleanUp()
  }

  extraStepsForGrayscale(){
    if(!this.error){
      if (this.grayscale === true) {
        const LastColorStep = this.to.pop()
        let tempTo = [
            this.sanitizeTo(LastColorStep, "grayscale"),
            this.sanitizeTo("grayscale",LastColorStep),
        ]
        if (tempTo[0] && tempTo[1]) {
            tempTo[0].pop()
            this.to = this.to.concat(tempTo[0],tempTo[1])
        }
      }  
    }
  }

  HexRefBuild(){
      if (this.settings.hexref) { 
        const stepsTemp = this.sanitizeTo(this.to[this.to.length - 1],'hex6') 
        this.hexref = this.ColorConvert(this.color, stepsTemp)
      } 
  }

  sanitizeForHex(settings){
    if (settings.hasOwnProperty('hex')){
      if(_colorSanitizer.isHex(settings.hex) === 6){
        settings.hex6 = settings.hex
      } else {
        settings.hex3 = settings.hex
      }
      delete settings.hex
    }
    return settings
  }

  sanitizeFrom(settings) {
    // filter flags
    let parameters = Object.keys(settings).filter( from => ["to", "hexref", "debug" ].indexOf(from) === -1 );
    if (
      parameters.indexOf("grayscale") > -1 &&
      typeof settings.grayscale === "boolean"
    ) {
      parameters.splice(parameters.indexOf("grayscale"), 1);
    }

    if (
      parameters.length === 1 &&
      _colorFactory.hasOwnProperty(parameters[0])
    ) {
      return parameters[0];
    } else if (parameters[0] === "color") {
      objectData.tell = _colorTell(objectData[parameters[0]]);

      if (objectData.tell) {
        objectData[objectData.tell] = objectData.color;
        if (objectData.tell === "hex") {
          if (_colorSanitizer.isHex(objectData.hex) === 3) {
            return "hex3";
          } else {
            return "hex6";
          }
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

  sanitizeTo(from, to) {
    if (!this.error) {
      // direct conversion
      if (_colorFactory[from].hasOwnProperty(to) || to === from) {
        return [from, to];
      }
      // steps conversion
      let tempPosibleColorMutations = Object.keys(_colorFactory)
      tempPosibleColorMutations = tempPosibleColorMutations.filter( keys => ['ral','pantone','grayscale'].indexOf(keys) === -1 )
      tempPosibleColorMutations = tempPosibleColorMutations.sort(function( x, y ) {  return x == "lab" ? -1 : y == "lab" ? 1 : 0; })

      // actual color steps 
      for(let i = 1; i < tempPosibleColorMutations.length; i++){
        let stepsTable = _permutation(tempPosibleColorMutations, from, to, i )
        for (let a = 0; a < stepsTable.length; a++){
          if( this.validateLine(stepsTable[a]) ){
            return stepsTable[a]
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
      if (!this.error){
        if (to[0] !== to[1]){
          for(let i=0;i< to.length-1; i++ ){
              tempColor = _colorFactory[to[i]][to[i+1]](tempColor)
          }
        }
        return tempColor     
      }
      return {}
  }
}

module.exports = color;