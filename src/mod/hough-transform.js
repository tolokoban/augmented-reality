"use strict";

var ANG_RES = 64;   // Angle réel compris en 0 et PI.
var LEN_RES = 64;
var HALF_LEN_RES = LEN_RES >> 1;

var C = new Float32Array( ANG_RES );
var S = new Float32Array( ANG_RES );

for( var i=0 ; i<ANG_RES ; i++ ) {
    var ang = i * Math.PI / ANG_RES;
    C[i] = Math.cos( ang );
    S[i] = Math.sin( ang );
}


/**
 * @param {Uint8ClampedArray} pixels.
 */
module.exports = function(pixels, w, h) {
    var lines = new Int16Array( ANG_RES * LEN_RES );
    var diag = Math.sqrt( w*w + h*h );
    HALF_LEN_RES = Math.max( w, h ) >> 1;
    LEN_RES = HALF_LEN_RES << 1;
    var z = HALF_LEN_RES / diag;
    w = w|0;
    h = h|0;
    var x = 0|0;
    var y = 0|0;
    var i = 1|0;
    var a, r, intPart, decPart;
    var count = 0;
    while( y < h ) {
        while( x < w ) {
            if( pixels[i] > 200 ) {
                // C'est un pixel vert !
                count++;
                a = 0|0;
                while( a < ANG_RES ) {
                    // Puisque a est entre 0 et PI, r peut être négatif.
                    r = z * (x * C[a] + y * S[a]);
                    intPart = Math.floor( r );
                    decPart = r - intPart;
                    intPart += HALF_LEN_RES;
                    if( intPart < LEN_RES ) {
                        lines[intPart * ANG_RES + a]++;
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

    console.log("I found " + count + " pixels!");
    /*
    var bestIdx = [0,0,0,0];
    var bestVal = [0,0,0,0];
    var nbLines = bestIdx.length;
    var minIdx;
    var minVal;
    var k;
    var j = 0;
    var v;
    i = lines.length - 1;
    while( j < nbLines ) {
        v = lines[i];
        bestVal[j] = v;
        bestIdx[j] = i;
        j++;
        i--;
    }
    while( i > 0 ) {
        v = lines[i];
        minIdx = 0;
        minVal = bestVal[0];
        for( k=1 ; k<nbLines ; k++ ) {
            if( bestVal[k] < minVal ) {
                minIdx = k;
                minVal = bestVal[k];
            }
        }
        if( v > minVal ) {
            bestVal[minIdx] = v;
            bestIdx[minIdx] = i;
        }
        i--;
    }
*/

    //--------------------------------
    var result = [];

    var maxVal = 0;
    lines.forEach(function (val, idx) {
        // Il faut au moins deux points pour faire une droite.
        // Mais trois, c'est un minimum pour qu'on y voit une intention.
        if( val < 3 ) return;
        maxVal = Math.max( maxVal, val );
        a = idx % ANG_RES;
        r = (idx - a) / ANG_RES;
        r = (r - HALF_LEN_RES) / z;
        x = r * C[a];
        y = r * S[a];
        result.push({
            x: x,
            y: y,
            vx: -S[a],
            vy: C[a],
            v: val
        });
    });
    console.log("I found " + result.length + " potential lines!");
    result.sort(function(a, b) {
        return b.v - a.v;
    });
    /*
    // Normaliser `v`.
    result.forEach(function (item) {
        item.v /= maxVal;        
    });
*/
    return result;

    for( k=0 ; k<nbLines ; k++ ) {
        if( bestVal[k] == 0 ) continue;
        a = bestIdx[k] % ANG_RES;
        r = Math.floor( (bestIdx[k] - a) / ANG_RES );
        console.info("[hough-transform] bestIdx, bestVal, r, a=", bestIdx[k], bestVal[k], r, a);
        r = (r - HALF_LEN_RES) / z;
        x = r * C[a];
        y = r * S[a];
        result.push({
            x: x,
            y: y,
            vx: -S[a],
            vy: C[a]
        });
    };
    return result;
}
