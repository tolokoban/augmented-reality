"use strict";


var $ = require("dom");
var DB = require("tfw.data-binding");

/**
 * @class Webcam
 *
 * @member {HTMLElement} video - The HTML5 <video> element.
 * @member {Promise} ready - Resolves in `this` when webcam is ready.
 * @member {number} width - Video width (depends on webcam).
 * @member {number} height - Video height (depends on webcam).
 */
var Webcam = function(opts) {
    var that = this;

    var w, h;
    var video = $.tag('video');
    DB.readOnly( this, 'video', video );
    var elem = $.elem( this, 'div', 'webcam', [video] );

    var ready = new new Promise(function (resolve, reject) {
        var streaming = false;
        video.addEventListener('canplay', function() {
            if (!streaming) {
                w = video.videoWidth;
                h = video.videoHeight;
                if( w > h ) {
                    // Landspace.
                } else {
                    // Portrait.
                }
                video.setAttribute('width', w);
                video.setAttribute('height', h);
                video.style["margin-left"] = (-w * .5) + "px";
                video.style["margin-top"] = (-h * .5) + "px";
                streaming = true;

                resolve( that );
            }
        }, false);
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                console.error("[picture snapshot] An error occured! ", err);
                reject( err );
            });
    });

    DB.readOnly( this, 'ready', ready );

    DB.propRemoveClass( this, 'visible', 'hide' );

    opts = DB.extend({
        visible: true
    }, opts, this);

    Object.defineProperty( Webcam.prototype, 'width', {
        get: function() { return w; },
        set: function(v) {},
        configurable: true,
        enumerable: true
    });

    Object.defineProperty( Webcam.prototype, 'height', {
        get: function() { return h; },
        set: function(v) {},
        configurable: true,
        enumerable: true
    });
};


/*
function startRendering( filter ) {
    function render() {
        filter.render();
        window.requestAnimationFrame( render );
    }
    window.requestAnimationFrame( render );
}
*/

module.exports = Webcam;
