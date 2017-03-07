"use strict";


var $ = require("dom");
var Webcam = require("webcam");
var Filter = require("filter");


exports.start = function() {
    var webcam = new Webcam();
    $.add( document.body, webcam );
    webcam.ready.then(function() {
        var filter = new Filter({ video: webcam.video, resolution: .2 });
        var w = webcam.width;
        var h = webcam.height;
        filter.width = w;
        filter.height = h;
        filter.element.style["margin-left"] = (-w * .5) + "px";
        filter.element.style["margin-top"] = (-h * .5) + "px";
        $.add( document.body, filter );
    });
};
