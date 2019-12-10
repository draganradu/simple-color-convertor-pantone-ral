const ralPattern = require('../color_list/ral.json')
const deltaE = require('../compare_colors/deltaE_CIEDE2000.js')

const colorConvertor = {
    cmyk: {},
    grayscale: {},
    hex3: {},
    hex6: {},
    lab: {},
    hsl: {},
    ral: {},
    rgb: {},
    w: {},
    xyz: {},
}

// 1 | --- CMYK
colorConvertor.cmyk.rgb = function(cmyk){
    let rgb = {
        r: Math.round(255 * ( 1 - cmyk.c / 100 ) * ( 1 - cmyk.k / 100 )),
        g: Math.round(255 * ( 1 - cmyk.m / 100 ) * ( 1 - cmyk.k / 100 )),
        b: Math.round(255 * ( 1 - cmyk.y / 100 ) * ( 1 - cmyk.k / 100 )),
    }

    return rgb
}

// 2 | --- grayscale
colorConvertor.grayscale.cmyk = function (grayscale) {
    return {c: 0, m: 0, y: 0, k: grayscale}
}

colorConvertor.grayscale.rgb = function (grayscale) {
    grayscale /=  100
    grayscale *= 255
    grayscale = Math.round(grayscale)
    return {r: grayscale, g: grayscale, b: grayscale}
}

colorConvertor.grayscale.w = function (grayscale) {
    return {error: 'You can`t get the wavelength of no color'}
}

// 3 | --- hex 3
colorConvertor.hex3.hex6 = function (hex3) {
    return [hex3[0],hex3[0],hex3[1],hex3[1],hex3[2],hex3[2]].join('').toUpperCase()
}

// 4 | --- hex 6
colorConvertor.hex6.hex3 = function (hex6) {
    function convertor (a,b) {
        let temp = ''
        temp = [a, b].join('')
        temp = parseInt(temp, 16)/16
        temp = Math.floor(temp)
        temp = temp.toString(16)
        return temp.toUpperCase()
    }
    const temp = {
        r: convertor(hex6[0], hex6[1]),
        g: convertor(hex6[2], hex6[3]),
        b: convertor(hex6[4], hex6[5]),
    }
    return [temp.r, temp.g, temp.b].join('')
}

colorConvertor.hex6.rgb = function (hex6) {
    const temp = {
        r: parseInt(hex6.substring(0, 2), 16),
        g: parseInt(hex6.substring(2, 4), 16),
        b: parseInt(hex6.substring(4, 6), 16),
    }
    return temp 
}

// 5 | --- hsl
colorConvertor.hsl.rgb = function (hsl) {
    const rgb = {
        r: 0,
        g: 0,
        b: 0,
    }

    hsl.h /= 60
    if (hsl.h < 0) {
        hsl.h = 6 - (-hsl.h % 6)
    }
    hsl.h %= 6

    hsl.s = Math.max(0, Math.min(1, hsl.s / 100))
    hsl.l = Math.max(0, Math.min(1, hsl.l / 100))

    hsl.c = (1 - Math.abs((2 * hsl.l) - 1)) * hsl.s
    hsl.x = hsl.c * (1 - Math.abs((hsl.h % 2) - 1))

    if (hsl.h < 1) {
        rgb.r = hsl.c
        rgb.g = hsl.x
        rgb.b = 0
    } else if (hsl.h < 2) {
        rgb.r = hsl.x
        rgb.g = hsl.c
        rgb.b = 0
    } else if (hsl.h < 3) {
        rgb.r = 0
        rgb.g = hsl.c
        rgb.b = hsl.x
    } else if (hsl.h < 4) {
        rgb.r = 0
        rgb.g = hsl.x
        rgb.b = hsl.c
    } else if (hsl.h < 5) {
        rgb.r = hsl.x
        rgb.g = 0
        rgb.b = hsl.c
    } else {
        rgb.r = hsl.c
        rgb.g = 0
        rgb.b = hsl.x
    }

    hsl.m = hsl.l - hsl.c / 2
    rgb.r = Math.round((rgb.r + hsl.m) * 255)
    rgb.g = Math.round((rgb.g + hsl.m) * 255)
    rgb.b = Math.round((rgb.b + hsl.m) * 255)

    return rgb
}

colorConvertor.hsl.w = function (hsl) {
    let temp = Math.round(620 - 170 / 270 * hsl.h)
    
    return temp
}

// 6 | --- html

// 7 | --- Lab

colorConvertor.lab.pantone = function(labOrigin){
    let lab = Object.create(labOrigin)
    let temp = {
        index: 768,
        name: '',
    }

    for(let pantone in pantonePattern){
       
        let t = deltaE(pantonePattern[pantone].lab, lab)
        if(t < temp.index){
            temp.index = t
            temp.name = pantonePattern[pantone].name
            if(temp.index === 1) {
                return temp.name
            }
        }
    }

    return temp.name
}

colorConvertor.lab.ral = function (lab){
    let temp = {
        index: 768,
        position: 9999
    }
   
    for(let ral in ralPattern){
        let t = deltaE(ralPattern[ral].lab, lab)
        if(t < temp.index){
            temp.index = t
            temp.position = ral
            if(temp.index === 0) {
                return { 
                    ral: ralPattern[temp.position].ral,
                    name: ralPattern[temp.position].name, 
                    lrv: ralPattern[temp.position].LRV,
                }
            }
        }
    }

    return { 
        ral: ralPattern[temp.position].ral,
        name: ralPattern[temp.position].name, 
        lrv: ralPattern[temp.position].LRV,
    }
}

colorConvertor.lab.rgb = function (lab) {
    let xyz = {
        x: 0, y:0 , z: 0 
    }

    xyz.y = (lab.l + 16) / 116,
    xyz.x = lab.a / 500 + xyz.y,
    xyz.z = xyz.y - lab.b / 200,

    xyz.x = 0.95047 * ((Math.pow(xyz.x,3) > 0.008856) ? Math.pow(xyz.x,3) : (xyz.x - 16/116) / 7.787)
    xyz.y = 1.00000 * ((Math.pow(xyz.y,3) > 0.008856) ? Math.pow(xyz.y,3) : (xyz.y - 16/116) / 7.787)
    xyz.z = 1.08883 * ((Math.pow(xyz.z,3) > 0.008856) ? Math.pow(xyz.z,3) : (xyz.z - 16/116) / 7.787)

    let rgb = { r:0, g:0, b:0 }
    rgb.r = xyz.x *  3.2406 + xyz.y * -1.5372 + xyz.z * -0.4986
    rgb.g = xyz.x * -0.9689 + xyz.y *  1.8758 + xyz.z *  0.0415
    rgb.b = xyz.x *  0.0557 + xyz.y * -0.2040 + xyz.z *  1.0570

    rgb.r = (rgb.r > 0.0031308) ? (1.055 * Math.pow(rgb.r, 1/2.4) - 0.055) : 12.92 * rgb.r
    rgb.g = (rgb.g > 0.0031308) ? (1.055 * Math.pow(rgb.g, 1/2.4) - 0.055) : 12.92 * rgb.g
    rgb.b = (rgb.b > 0.0031308) ? (1.055 * Math.pow(rgb.b, 1/2.4) - 0.055) : 12.92 * rgb.b

    rgb.r = Math.round(Math.max(0, Math.min(1, rgb.r)) * 255)
    rgb.g = Math.round(Math.max(0, Math.min(1, rgb.g)) * 255)
    rgb.b = Math.round(Math.max(0, Math.min(1, rgb.b)) * 255)

    return rgb
}

// 8 | --- ral
colorConvertor.ral.rgb = function (ral) {
    let temp = ralPattern.filter( a => a.ral === ral.ral )
    return temp.length ? temp[0].rgb : false
}

colorConvertor.ral.cmyk = function (ral) {
    let temp = ralPattern.filter( a => a.ral === ral.ral )
    return temp.length ? temp[0].cmyk : false
}

colorConvertor.ral.lab = function (ral) {
    let temp = ralPattern.filter( a => a.ral === ral.ral )
    return temp.length ? temp[0].lab : false
}

// 9 | --- rgb
colorConvertor.rgb.hex6 = function (rgb) {
    function rgbNormalize (color) {
        if (color < 16) {
            color = '0' + color.toString(16)
        } else {
            color = color.toString(16)
        }

        return color
    }
    return [rgbNormalize(rgb.r), rgbNormalize(rgb.g), rgbNormalize(rgb.b)].join('').toUpperCase()
}

colorConvertor.rgb.hsl = function (rgb) {
    // Make r, g, and b fractions of 1
    rgb.r /= 255
    rgb.g /= 255
    rgb.b /= 255

    // Find greatest and smallest channel values
    rgb.cmin = Math.min(rgb.r,rgb.g,rgb.b),
    rgb.cmax = Math.max(rgb.r,rgb.g,rgb.b),
    rgb.delta = rgb.cmax - rgb.cmin,
    rgb.h = 0,
    rgb.s = 0,
    rgb.l = 0

    // Calculate hue
    // No difference
    if (rgb.delta == 0)
        rgb.h = 0
        // Red is max
    else if (rgb.cmax === rgb.r)
        rgb.h = ((rgb.g - rgb.b) / rgb.delta) % 6
        // Green is max
    else if (rgb.cmax === rgb.g)
        rgb.h = (rgb.b - rgb.r) / rgb.delta + 2
        // Blue is max
        else
        rgb.h = (rgb.r - rgb.g) / rgb.delta + 4

        rgb.h = Math.round(rgb.h * 60)
        
        // Make negative hues positive behind 360°
    if (rgb.h < 0)
        rgb.h += 360

        rgb.l = (rgb.cmax + rgb.cmin) / 2

            // Calculate saturation
        rgb.s = rgb.delta == 0 ? 0 : rgb.delta / (1 - Math.abs(2 * rgb.l - 1))
              
            // Multiply l and s by 100
        rgb.s = +(rgb.s * 100).toFixed(1)
        rgb.l = +(rgb.l * 100).toFixed(1)
        
        return {h: rgb.h ,s: rgb.s ,l: rgb.l }
}

colorConvertor.rgb.grayscale = function (rgb) {
    return Math.round(((0.3 * rgb.r) + (0.59 * rgb.g) + (0.11 * rgb.b))/ 2.56)
}

colorConvertor.rgb.lab = function (rgb) {
    rgb.r = rgb.r/255
    rgb.g = rgb.g/255
    rgb.b = rgb.b/255

    rgb.r = (rgb.r > 0.04045) ? Math.pow((rgb.r + 0.055) / 1.055, 2.4) : rgb.r / 12.92
    rgb.g = (rgb.g > 0.04045) ? Math.pow((rgb.g + 0.055) / 1.055, 2.4) : rgb.g / 12.92
    rgb.b = (rgb.b > 0.04045) ? Math.pow((rgb.b + 0.055) / 1.055, 2.4) : rgb.b / 12.92

    let xyz = { x: 0, y: 0, z: 0}

    xyz.x = (rgb.r * 0.4124 + rgb.g * 0.3576 + rgb.b * 0.1805) / 0.95047
    xyz.y = (rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722) / 1.00000
    xyz.z = (rgb.r * 0.0193 + rgb.g * 0.1192 + rgb.b * 0.9505) / 1.08883

    xyz.x = (xyz.x > 0.008856) ? Math.pow(xyz.x, 1/3) : (7.787 * xyz.x) + 16/116
    xyz.y = (xyz.y > 0.008856) ? Math.pow(xyz.y, 1/3) : (7.787 * xyz.y) + 16/116
    xyz.z = (xyz.z > 0.008856) ? Math.pow(xyz.z, 1/3) : (7.787 * xyz.z) + 16/116

  return {l:((116 * xyz.y) - 16), a: (500 * (xyz.x - xyz.y)), b: (200 * (xyz.y - xyz.z))}
}

colorConvertor.rgb.cmyk = function (rgb){
    let cmyk = {
        c: 0,
        m: 0,
        y: 0,
        k: 0,
    }

    if (rgb.r === 0 && rgb.g === 0 && rgb.b === 0) {
        cmyk.k = 100
    } else {

        rgb.r = rgb.r / 255
        rgb.g = rgb.g / 255
        rgb.b = rgb.b / 255

        cmyk.k = 1 - Math.max(rgb.r, rgb.g, rgb.b)

        if (cmyk.k == 1) {
            cmyk.c = 0
            cmyk.m = 0
            cmyk.y = 0
        } else {
            cmyk.c = (1 - rgb.r - cmyk.k) / (1 - cmyk.k)
            cmyk.m = (1 - rgb.g - cmyk.k) / (1 - cmyk.k)
            cmyk.y = (1 - rgb.b - cmyk.k) / (1 - cmyk.k)

            cmyk.c = Math.round(cmyk.c * 100)
            cmyk.m = Math.round(cmyk.m * 100)
            cmyk.y = Math.round(cmyk.y * 100)
            cmyk.k = Math.round(cmyk.k * 100)
        }
    }
    return cmyk
}

colorConvertor.rgb.html = function(rgb){
    let temp = {
        index: 768,
        html: '',
    }

    for(let html in htmlPattern){
        let t = Math.abs(htmlPattern[html].rgb.r - rgb.r ) + Math.abs(htmlPattern[html].rgb.g - rgb.g ) + Math.abs(htmlPattern[html].rgb.b - rgb.b )
        if(t < temp.index){
            temp.index = t
            temp.html = htmlPattern[html].name
            if(temp.index === 0) {
                return temp.html
            }
        }
    }

    return temp.html
}

colorConvertor.rgb.xyz = function(rgb) {
    let xyz = {}
	rgb.r /= 255
	rgb.g /= 255
	rgb.b /= 255

	// assume sRGB
	rgb.r = rgb.r > 0.04045 ? Math.pow(((rgb.r + 0.055) / 1.055), 2.4) : (rgb.r / 12.92)
	rgb.g = rgb.g > 0.04045 ? Math.pow(((rgb.g + 0.055) / 1.055), 2.4) : (rgb.g / 12.92)
	rgb.b = rgb.b > 0.04045 ? Math.pow(((rgb.b + 0.055) / 1.055), 2.4) : (rgb.b / 12.92)

	xyz.x = (rgb.r * 0.41239079926595) + (rgb.g * 0.35758433938387) + (rgb.b * 0.18048078840183)
	xyz.y = (rgb.r * 0.21263900587151) + (rgb.g * 0.71516867876775) + (rgb.b * 0.072192315360733)
	xyz.z = (rgb.r * 0.019330818715591) + (rgb.g * 0.11919477979462) + (rgb.b * 0.95053215224966)

    xyz.x = xyz.x * 94.972
    xyz.y = xyz.y * 100
    xyz.z = xyz.z * 122.638
	return xyz
}

// 10 | --- w
colorConvertor.w.rgb = function(w) {
    let rgb = {
        r: 0,
        g: 0,
        b: 0,
    }

     if (w >= 380 && w < 440) {
         rgb.r = -1 * (w - 440) / (440 - 380)
         rgb.b = 1
    } else if (w >= 440 && w < 490) {
        rgb.g = (w - 440) / (490 - 440)
        rgb.b = 1
     } else if (w >= 490 && w < 510) {
         rgb.g  = 1
         rgb.b = -1 * (w - 510) / (510 - 490)
     } else if (w >= 510 && w < 580) {
         rgb.r = (w - 510) / (580 - 510)
         rgb.g = 1
     } else if (w >= 580 && w < 645) {
         rgb.r = 1
         rgb.g = -1 * (w - 645) / (645 - 580)
     } else if (w >= 645 && w <= 780) {
         rgb.r = 1
     } 

     rgb.r = Math.round(rgb.r * 255)
     rgb.g = Math.round(rgb.g * 255)
     rgb.b = Math.round(rgb.b * 255)

     return rgb;
}

// 10 | --- XYZ
colorConvertor.xyz.rgb = function(xyz) {
    function sRGB(color) {
        if (Math.abs(color) < 0.0031308) {
          return 12.92 * color;
        }
        return 1.055 * Math.pow(color, 0.41666) - 0.055;
      }
    
    rgb = {  
        r : sRGB(3.2404542* xyz.x - 1.5371385* xyz.y - 0.4985314* xyz.z),
        g : sRGB(-0.9692660* xyz.x + 1.8760108* xyz.y + 0.0415560* xyz.z),
        b : sRGB(0.0556434* xyz.x - 0.2040259* xyz.y + 1.0572252* xyz.z),
    }

    return rgb

}
module.exports = colorConvertor