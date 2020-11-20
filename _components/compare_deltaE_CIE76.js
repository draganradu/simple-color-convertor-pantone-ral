'use strict'

module.exports = function (lab1, lab2){	
    return Math.sqrt(Math.pow((lab1.l - lab2.l),2) + Math.pow((lab1.a - lab2.a),2) + Math.pow((lab1.b - lab2.b),2)) 	
} 