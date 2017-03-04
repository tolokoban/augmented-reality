"use strict";


"use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");
var Filter = require("filter");

// The filtered image, has a size of (w,h). RESOLUTION = Min( w, h ).
var RESOLUTION = 100;

/**
 * @class Webcam
 *
 * Arguments:
 * * __visible__ {boolean}: Visibility of the component.
 *
 * @example
 * var Webcam = require("webcam");
 * var instance = new Webcam({visible: false});
 */
var Webcam = function(opts) {
    var video = $.tag('video');
    var filter = new Filter({ video: video, resolution: .2 });
    var elem = $.elem( this, 'div', 'webcam', [video, filter] );

    var streaming = false;
    video.addEventListener('canplay', function() {
        if (!streaming) {
            var w = video.videoWidth;
            var h = video.videoHeight;
            if( w > h ) {
                // Landspace.
            } else {
                // Portrait.
            }
            console.info("[webcam] filter.width=", filter.width);
            console.info("[webcam] filter.height=", filter.height);

            video.setAttribute('width', w);
            video.setAttribute('height', h);
            video.style["margin-left"] = (-w * .5) + "px";
            video.style["margin-top"] = (-h * .5) + "px";
            filter.width = w;
            filter.height = h;
            filter.element.style["margin-left"] = (-w * .5) + "px";
            filter.element.style["margin-top"] = (-h * .5) + "px";            
            streaming = true;

            startRendering.call( this, filter );
        }
    }, false);
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function(err) {
            console.error("[picture snapshot] An error occured! ", err);
        });


    DB.propRemoveClass( this, 'visible', 'hide' );

    opts = DB.extend({
        visible: true
    }, opts, this);
};


function startRendering( filter ) {
    function render() {
        filter.render();
        window.requestAnimationFrame( render );
    }
    window.requestAnimationFrame( render );
}


module.exports = Webcam;
