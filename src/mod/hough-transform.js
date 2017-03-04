"use strict";

var ANG_RES = 64;
var LEN_RES = 100;
var HALF_LEN_RES = LEN_RES >> 1;

var C = new Float32Array( ANG_RES );
var S = new Float32Array( ANG_RES );

for( var i=0 ; i<ANG_RES ; i++ ) {
    var ang = 2 * i * Math.PI / ANG_RES;
    C[i] = Math.cos( ang );
    S[i] = Math.sin( ang );
}


/**
 * @param {Uint8ClampedArray} pixels.
 */
module.exports = function(pixels, w, h) {
    var lines = new Int16Array( ANG_RES * LEN_RES );
    var z = HALF_LEN_RES / Math.sqrt( w*w + h*h );
    w = w|0;
    h = h|0;
    var x = 0|0;
    var y = 0|0;
    var i = 1|0;
    var a, r;
    while( y < h ) {
        while( x < w ) {
            if( pixels[i] > 200 ) {
                // C'est un pixel vert !
                a = 0|0;
                while( a < ANG_RES ) {
                    r = x * C[a] + y * S[a];
                    r = Math.floor( z * (HALF_LEN_RES + r) );
                    if( r >= 0 && r < LEN_RES ) {
                        lines[r * ANG_RES + a]++;
                    }
                    a++;
                }
            }
            x++;
            i += 4;
        }
        x = 0|0;
        y++;
    }

    var bestIdx = 0;
    var bestVal = 0;
    var v;
    i = lines.length;
    while( i > 0 ) {
        v = lines[i];
        if( v > bestVal ) {
            bestVal = v;
            bestIdx = i;
        }
        i--;
    }

    //--------------------------------
    a = bestIdx % ANG_RES;
    r = Math.floor((bestIdx - a) / LEN_RES) / z;
    console.info("[hough-transform] bestIdx, bestVal, r, a=", bestIdx, bestVal, r, a);
    r = r / z - HALF_LEN_RES;
    x = r * C[a];
    y = r * S[a];
    return { x: x, y: y, a: a * 2 * Math.PI / ANG_RES };
};
