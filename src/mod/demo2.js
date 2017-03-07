"use strict";


var $ = require("dom");
var HoughTransform = require("hough-transform");


var g_result = [];
var g_index = 0;
var g_scale = 6;
var g_imageData;
var g_ctx;
var g_img;


exports.start = function() {
    var img = new Image();
    g_img = img;
    img.src = "css/demo2/test1.jpg";
    img.onload = function() {
        var w = img.width * g_scale;
        var h = img.height * g_scale;
        var canvas = $.tag( 'canvas', { width: w, height: h } );
        $.add( 'output', canvas );
        g_ctx = canvas.getContext( '2d' );
        g_imageData = getImageData( img );
        g_result = HoughTransform( g_imageData.data, g_imageData.width, g_imageData.height );
        drawLine( g_index );
    };
};


exports.onLeft = function(v) {
    drawLine( g_index - parseInt(v) );
};


exports.onRight = function(v) {
    drawLine( g_index + parseInt(v) );
};


function drawLine( idx ) {
    var w = g_img.width * g_scale;
    var h = g_img.height * g_scale;
    g_ctx.drawImage( g_img, 0, 0, w, h );

    if( idx < 0 ) idx = 0;
    idx = Math.min( idx, g_result.length - 1 );
    g_index = idx;
    var item = g_result[idx];

    $('line').textContent = idx + ": " + JSON.stringify( item );
    
    var vx = 1000 * item.vx;
    var vy = 1000 * item.vy;
    var x = item.x * g_scale + g_scale / 2;
    var y = item.y * g_scale + g_scale / 2;
    var x1 = x - vx;
    var y1 = y - vy;
    var x2 = x + vx;
    var y2 = y + vy;
    g_ctx.strokeStyle = '#800';
    g_ctx.beginPath();
    g_ctx.moveTo( 0, 0 );
    g_ctx.lineTo( x, y );
    g_ctx.stroke();
    g_ctx.strokeStyle = 'red';
    g_ctx.beginPath();
    g_ctx.moveTo( x1, y1 );
    g_ctx.lineTo( x2, y2 );
    g_ctx.stroke();
}

function getImageData( img ) {
    var w = img.width;
    var h = img.height;
    var canvas = $.tag( 'canvas', { width: w, height: h } );
    var ctx = canvas.getContext( '2d' );
    ctx.drawImage( img, 0, 0 );
    return ctx.getImageData( 0, 0, w, h );
}
