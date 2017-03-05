"use strict";

var ANG_RES = 64;   // Angle réel compris en 0 et PI/2.
var LEN_RES = 256;

var C = new Float32Array( ANG_RES );
var S = new Float32Array( ANG_RES );

for( var i=0 ; i<ANG_RES ; i++ ) {
    var ang = .5 * i * Math.PI / ANG_RES;
    C[i] = Math.cos( ang );
    S[i] = Math.sin( ang );
}


/**
 * @param {Uint8ClampedArray} pixels.
 */
module.exports = function(pixels, w, h) {
    var lines = new Int16Array( ANG_RES * LEN_RES );
    var diag = Math.sqrt( w*w + h*h );
    var z = LEN_RES / diag;
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
                    // Puisque a est entre 0 et PI/2, r est positif.
                    r = x * C[a] + y * S[a];
                    r = Math.floor( z * r );
                    if( r < LEN_RES ) {
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

    var bestIdx = [0,0,0,0];
    var bestVal = [0,0,0,0];
    var minIdx;
    var minVal;
    var k;
    var j = 0;
    var v;
    i = lines.length - 1;
    while( j < 4 ) {
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
        for( k=1 ; k<4 ; k++ ) {
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

    //--------------------------------
    var result = [];
/*
    var maxVal = 0;
    lines.forEach(function (val, idx) {
        // Il faut au moins deux points pour faire une droite.
        // Mais trois, c'est un minimum pour qu'on y voit une intention.
        if( val < 3 ) return;
        maxVal = Math.max( maxVal, val );
        a = idx % ANG_RES;
        r = Math.floor( (idx - a) / ANG_RES );
        r = r / z;
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

    // Normaliser `v`.
    result.forEach(function (item) {
        item.v /= maxVal;        
    });

    return result;
*/
    for( k=0 ; k<4 ; k++ ) {
        if( bestVal[k] == 0 ) continue;
        a = bestIdx[k] % ANG_RES;
        r = Math.floor( (bestIdx[k] - a) / ANG_RES );
        console.info("[hough-transform] bestIdx, bestVal, r, a=", bestIdx[k], bestVal[k], r, a);
        r = r / z;
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
