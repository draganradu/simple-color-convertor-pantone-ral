module.exports = function (rgb1,rgb2){
    return Math.sqrt(Math.pow((rgb2.r - rgb1.r),2) + Math.pow((rgb2.g - rgb2.g),2) + Math.pow((rgb2.b - rgb2.b),2)) 
}