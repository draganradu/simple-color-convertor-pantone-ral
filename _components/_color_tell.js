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

  const colorTest = ["rgb", "cmyk", "hsl", "lab"];

  if (typeof data === "object") {
    for (let i of colorTest.concat("w")) {
      if (ColorHasKeys(i, data)) {
        return i;
      }
    }
  } else if (typeof data === "string") {
    for (let i of colorTest.concat(["pantone", "ral", "#"])) {
      if (data.indexOf(i) > -1) {
        return i === "#" ? "hex" : i;
      }
    }

    for (let i of colorTest){
        let regex = new RegExp(`[^${i}]`,'g')
        let temp = data.replace(regex,'')
        if(sortString(temp) === sortString(i)){
            return i
        }
    }
  }
  
  return false;
};
