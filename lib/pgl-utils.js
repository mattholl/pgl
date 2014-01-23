/**
 * Some utility functions which don't require plask
 */

module.exports = {

    degToRad : function (degrees) {
        return degrees * (Math.PI/180);
    },

    radToDeg : function(radians) {
        return (Math.PI/180) / radians;
    },

    hexToRGB : function( hex ) {

        var hexString = hex;

        if(hexString.charAt(0) === '#') {
            hexString = hexString.substring(1, hexString.length);
        }

        var redHex = hexString.charAt(0) + hexString.charAt(1);
        var blueHex = hexString.charAt(2) + hexString.charAt(3);
        var greenHex = hexString.charAt(4) + hexString.charAt(5);

        var redInt = parseInt(redHex, 16);
        var blueInt = parseInt(blueHex, 16);
        var greenInt = parseInt(greenHex, 16);

        var redLerped = redInt * (1/255);
        var blueLerped = blueInt * (1/255);
        var greenLerped = greenInt * (1/255);

        return [redLerped, blueLerped, greenLerped];
    },

    // WRITE A UNIT TEST FOR THIS
    merge : function(settings, defaults) {
        var obj = {};

        if(settings) {
            for(var setting in defaults) {
                if(settings.setting) {
                    obj[setting] = settings[setting];
                } else {
                    obj[setting] = defaults[setting];
                }
            }
        } else {
            obj = defaults;
        }



    //     var settings = {
    //     geometry : defaults.geometry || params.geometry,
    //     scene : this,
    //     name : params.name || defaults.name,
    //     position: defaults.position || params.position,
    //     wireframe : defaults.wireframe
    // };
        return obj;
    }

};