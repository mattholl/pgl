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

    merge : function(settings, defaults) {
        var obj = {};

        if(settings) {
            for(var setting in defaults) {
                if(settings[setting]) {
                    obj[setting] = settings[setting];
                } else {
                    obj[setting] = defaults[setting];
                }
            }
        } else {
            obj = defaults;
        }

        return obj;
    },

    geoCarte : function(lat, lon) {
        // Approximate radius of the earth 6371km
        var R = 6378137.0;

        var cosLat = Math.cos(this.degToRad(lat));
        var sinLat = Math.sin(this.degToRad(lat));
        var cosLon = Math.cos(this.degToRad(lon));
        var sinLon = Math.sin(this.degToRad(lon));

        var f = 1.0 / 298.257224;
        var C = 1.0 / Math.sqrt(cosLat * cosLat + (1 - f) * (1 - f) * sinLat * sinLat);
        var S = (1.0 - f) * (1.0 - f) * C;
        var h = 0.0;

        var x = (R * C + h) * cosLat * cosLon;
        var y = (R * C + h) * cosLat * sinLon;
        var z = (R * S + h) * sinLat;

        return [x, y, z];
    }
};