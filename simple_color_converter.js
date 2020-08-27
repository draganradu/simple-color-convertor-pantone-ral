'use strict'
const _colorFactory   = require('./_components/_color_paint_factory')
const _colorSanitizer = require('./_components/_color_sanitizer')
const _colorTell      = require('./_components/_color_tell')
const _permutation    = require('./_components/frame/_frame_permutation')

const _clone          = require('./_components/frame/_frame_clone')
const _removeFromArray= require('./_components/frame/_remove_array_from_array')

class color {
  constructor (settingsArg = {}) {
    this.settings = settingsArg
    
    // to and from init setter
    this.from = this.settings
    this.to = this.settings

    // convert
    this.color = this.ColorConvert(this.sanitizedColor, this.to)

    // build extra hex3 for 
    this.cleanUp()
  }

  // -------------- 0 | Main getters and setters
  get sanitizedColor () {
      return (this.from && this.to) ? _colorSanitizer[this.from](this.settings[this.from]) : false
  }

  get settings () {
    return this._settings;
  }

  set settings (value) {
    const _this = _clone(value)
    const garbage = {
      removeKey:'',
      setKey: '',
    }

    if (_this.hasOwnProperty('hex') && _colorSanitizer.hex(_this.hex)){
      garbage.removeKey = 'hex'
      garbage.setKey = 'hex' + _colorSanitizer.hex(_this.hex).length
    } else if (_this.hasOwnProperty('android') && _colorSanitizer.hex(_this.android)){
      garbage.removeKey = 'android'
      garbage.setKey = 'hex' + _colorSanitizer.hex(_this.android).length
    }

    if (garbage.setKey && garbage.removeKey ) {
      _this[garbage.setKey] = _this[garbage.removeKey]
      delete _this[garbage.removeKey]
    }

    this._settings = _this
  }

  get from () {
    return this._form
  }

  set from (valSettings) {
    this._form = this.sanitizeFrom(valSettings)
  }

  get to () {
    return this._to
  }

  set to (val) {
    this._to = this.sanitizeTo(this.from, this.settings.to)
    this.extraStepsForGrayscale()
  }

  // -------------- 1 | Secoundary setters and getters
  get debug () {
    return (this._settings.debug)? true: false
  }

  // -------------- 2 | Methods
  extraStepsForGrayscale () {
    if (!this.settings.error) {
      if (this.settings.grayscale === true) {
        // extract last element in to
        const LastColorStep = this.to.pop()
        const tempTo = [
            this.sanitizeTo(LastColorStep, 'grayscale'),
            this.sanitizeTo('grayscale', LastColorStep),
        ]
        
        if (tempTo[0] && tempTo[1]) {
            tempTo[0].pop()
            this._to = this._to.concat(tempTo[0],tempTo[1])
        }
      }  
    }
  }

  hexRefBuild () {
      if (this.settings.hexref) { 
        const lastElement = this.to[this.to.length - 1]
        const stepsTemp = this.sanitizeTo(lastElement,'hex6') 

        if(lastElement === 'ral' || lastElement === 'html') {
          this.hexref = this.ColorConvert(_colorSanitizer[lastElement](this.color), stepsTemp)
        } else {
          this.hexref = this.ColorConvert(this.color, stepsTemp)
        }
        
        return true
      } 
      return false
  }

  sanitizeExceptionsFrom(parameters) {
    // remove the elements that are not colors
    parameters = _removeFromArray(parameters, ['to', 'hexref', 'debug' ])

    // Figure out wildcard colors
    const parametersException = parameters.filter( from => ['color', 'from'].indexOf(from) > -1 )

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
    
    if ( parameters.indexOf('grayscale') > -1 && typeof settings.grayscale === 'boolean' &&  parameters.length > 1 ) {
      parameters.splice(parameters.indexOf('grayscale'), 1);
    }

    console.log(_colorFactory)
    if ( parameters.length === 1 &&  _colorFactory.keys.indexOf(parameters[0]) > -1 ) {
      return parameters[0];
    } else if (parameters[0] === 'color') {
      const objectData = {}
      objectData.tell = _colorTell(objectData[parameters[0]]);

      if (objectData.tell) {
        objectData[objectData.tell] = objectData.color;
        if (objectData.tell === 'hex') {
          return _colorSanitizer.isHexVerbos(objectData.hex)
        }
        return objectData.tell;
      } else {
        this.settings.error = 'Inputed color dose not math any color format';
      }
    } else {
      this.settings.error = 'The color specified in from is not an accepted input';
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
    const temp = []
    for(let a = 0; a < (array.length -1); a++){
      temp.push(_colorFactory[array[a]].hasOwnProperty(array[a+1]))
    }
    
    return (temp.indexOf(false) < 0 )
  }

  sanitizeExceptionsTo(to){
    const listOfExceptions = {
      hex: 'hex6',
      android: 'hex8',
      decimal: 'rgbdecimal',
      web: 'hex3',
      websafe: 'hex3',
    }
    if(listOfExceptions.hasOwnProperty(to)){
      return listOfExceptions[to]
    } 
    return to
  }

  sanitizeTo(from, to) {
    if (!this.settings.error) {

      to = this.sanitizeExceptionsTo(to)

      if ( _colorFactory[from].hasOwnProperty(to) || to === from ) {
        return [from, to];
      }

      // actual color steps 
      if ( _colorFactory.keys.indexOf(to) !== -1) {
        for(let i = 1; i < _colorFactory.keysFilterd.length; i++){
          const stepsTable = _permutation(_colorFactory.keysFilterd, from, to, i )
          for (let a = 0; a < stepsTable.length; a++){
            if( this.validateLine(stepsTable[a]) ){
              return stepsTable[a]
            }
          }
        }
      }

      this.settings.error = 'The value you want to convert to is not acceptable' ;
    }

    return false;
  }

  cleanUp () {
    this.hexRefBuild();

    const tempKeys = _removeFromArray(Object.keys(this), ['hexref', 'color'])

    if (this.settings.error) {
      tempKeys.splice(tempKeys.indexOf('error'), 1);
    } 

    if(this.debug !== true){
      for (const i of tempKeys) {
        delete this[i];
      }
    }
  }

  ColorConvert (tempColor, to) {
    if (!this.settings.error && tempColor && to){
        // normal flow
        if (to[0] !== to[1]){
          for(let i = 0; i < to.length -1 ; i++ ){
              tempColor = _colorFactory[to[i]][to[i+1]](_clone(tempColor))
          }
        // if the to and from are both hex return uppercase value  
        } else if (['hex3', 'hex4', 'hex6', 'hex8'].indexOf(to[0]) > -1) {
          return tempColor.toUpperCase()
        }
        // if to and from are both the same and not hex
        return tempColor     
      }
      this.settings.error = this.settings.error || 'Can`t convert color.'
      return {}
  }
}

module.exports = color;