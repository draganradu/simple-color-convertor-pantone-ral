const colorSanitizer = require('../_components/_color_sanitizer')

module.exports = function(data) {
  function sortString(string){
      return string.split('').sort().join('')
  }  

  function ColorHasKeys(color, data) {
    for (let i = 0; i < color.length; i++) {
      if (!data.hasOwnProperty(color[i])) {
        return false;
      }
    }
    return true;
  }

  const colorTest = Object.keys(colorSanitizer).filter(i => ['isHex','hex', 'isHexVerbos'].indexOf(i) === -1);

  if (typeof data === "object") {
    for (let i of colorTest.concat("w")) {
      if (ColorHasKeys(i, data)) {
        return i;
      }
    }
  } else if (typeof data === "string") {
    // this works the others not so much
    // ------------------------------------------------------------------------
    // 1 | run index of if value is found in color it is probably that
    for (let i of colorTest) {
      if(data.indexOf(i) !== -1 && colorSanitizer[i](data)){ return i }
    }

    // 2| run sanitizer if value is acceptable it is returned
    for (let i of colorTest) {
      let tempSanitized = colorSanitizer[i](data)

      // console.log(i, '|' ,tempSanitized) // sanitization work
      if (tempSanitized) { return i }
    }
    return false;
  }
  
  return false;
};
