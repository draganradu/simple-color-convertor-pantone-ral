const _colorSanitizer = require('../_components/_color_sanitizer')

module.exports = function(data) {
  function everyKeyIndexOf(keys, string){
    for (let i of keys){
      if(string.indexOf(i) === -1 ){
        return false;
      }
    }

    return true;
  }

  function ColorHasKeys(color, data) {
    for (let i = 0; i < color.length; i++) {
      if (!data.hasOwnProperty(color[i])) {
        return false;
      }
    }
    return true;
  }
  
  _colorSanitizer.keys.sort(function(a, b){
    return b.length - a.length;
  })

  if (typeof data === "number") {
    for (let i of ['grayscale', 'w', 'ral'] ) {
      if(_colorSanitizer[i](data)){ 
        return i 
      }
    }
  } else if (typeof data === "object") {
    for (let i of _colorSanitizer.keys) {
      if (ColorHasKeys(i, data)) {
        return i;
      }
    }
  } else if (typeof data === "string") {
    // this works the others not so much
    // ------------------------------------------------------------------------
    // 1 | run index of if value is found in color it is probably that
   
    for (let i of _colorSanitizer.keys) {
      if((data.indexOf(i) > -1 || everyKeyIndexOf(i,data)) && _colorSanitizer[i](data)){
        return i 
      }
    }

    // 2| run sanitizer if value is acceptable it is returned
    for (let i of _colorSanitizer.keys) {
      let tempSanitized = _colorSanitizer[i](data)

      // console.log(i, '|' ,tempSanitized) // sanitization work
      if (tempSanitized) { 
        return i 
      }
    }
    return false;
  }
  
  return false;
};
