"use strict";


"use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");
var WebGL = require("tfw.webgl");
var Modal = require("wdg.modal");
var HoughTransform = require("hough-transform");


/**
 * @class Filter
 *
 * Arguments:
 * * __visible__ {boolean}: Visibility of the component.
 *
 * @example
 * var Filter = require("filter");
 * var instance = new Filter({visible: false});
 */
var Filter = function(opts) {
    var that = this;

    var elem = $.elem( this, 'canvas' );
    initWebGL.call( this );
    window.addEventListener( 'keydown', function(evt) {
        if( evt.keyCode != 32 ) return;

        var url = elem.toDataURL("image/jpeg", 1.0);
        //window.open(url, '_BLANK');
        var img = new Image();
        img.src = url;
        img.onload = function() {
            var w = that.width;
            var h = that.height;
            var canvas = $.tag( 'canvas', { width: w, height: h } );
            var ctx = canvas.getContext( '2d' );
            ctx.drawImage( img, 0, 0, w, h );
            var data = ctx.getImageData( 0, 0, w, h ).data;
            var result = HoughTransform( data, w, h );
            console.info("[filter] result=", result);      
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            var vx = 10000 * Math.cos( result.a );
            var vy = 10000 * Math.sin( result.a );
            var x = result.x / that.resolution;
            var y = result.y / that.resolution;
            var x1 = x - vx;
            var y1 = y - vy;
            var x2 = x + vx;
            var y2 = y + vy;
            ctx.moveTo( x1, y1 );
            ctx.lineTo( x2, y2 );
            ctx.stroke();
console.info("[filter] x1, y1, x2, y2=", x1, y1, x2, y2);
            $.css( canvas, {
                width: canvas.width+ "px",
                height: canvas.height+ "px",
                background: "#ccc"
            });
            Modal.alert( canvas );
        };
    }, true);

    DB.propRemoveClass( this, 'visible', 'hide' );
    DB.prop( this, 'video' )(function(v) {
        console.info("[filter] v=", v);
    });
    DB.propFloat( this, 'resolution' );
    DB.propInteger( this, 'width' )(function(v) {
        that._W = v * that.resolution;
        that._DX = 1.0 / that._W;
        $.css( elem, { width: v + "px" });
        $.att( elem, { width: v * that.resolution });
        that._gl.viewport( 0, 0, that._W, that._H );
    });
    DB.propInteger( this, 'height' )(function(v) {
        that._H = v * that.resolution;
        that._DY = 1.0 / that._H;
        $.css( elem, { height: v + "px" });
        $.att( elem, { height: v * that.resolution });
        that._gl.viewport( 0, 0, that._W, that._H );
    });
    opts = DB.extend({
        visible: true,
        video: null,
        resolution: .25,
        width: 320,
        height: 240
    }, opts, this);
};


/**
 * @member Filter.
 * @param
 */
Filter.prototype.render = function() {
    var gl = this._gl;
    var prg = this._prg;

    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    prg.use();
    prg.$uniW = this._DX;
    prg.$uniH = this._DY;

    // Disable depth testing
    gl.disable(gl.DEPTH_TEST);

    // Définir ce buffer comme le buffer actif.
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
    // Copier des données dans le buffer actif.
    gl.bufferData(gl.ARRAY_BUFFER, this._data, gl.STATIC_DRAW);

    var bpe = this._data.BYTES_PER_ELEMENT;
    var blockSize = 2 * bpe;
    // attPosition
    gl.enableVertexAttribArray(prg.$attPosition);
    gl.vertexAttribPointer(prg.$attPosition, 2, gl.FLOAT, false, blockSize, 0);

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                  gl.UNSIGNED_BYTE, this.video);

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Copy triangles coordinates.
    gl.bufferData(gl.ARRAY_BUFFER, this._data, gl.STATIC_DRAW);
    // Draw triangles.
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
};


function initWebGL() {
    var canvas = this.element;
    var opts = {
        alpha: true,
        antialias: false,
        preserveDrawingBuffer: true,
        premultipliedAlpha: false
    };
    var gl = canvas.getContext('webgl', opts) 
            || canvas.getContext('experimental-webgl', opts);
    this._gl = gl;

    var prg = new WebGL.Program(this._gl, {
        vert: GLOBAL.vert,
        frag: GLOBAL.frag
    });
    this._prg = prg;
    this._canvas = canvas;

    // Données de deux triangles qui forment un carré.
    this._data = new Float32Array([
            -1, -1,
            +1, -1,
            +1, +1,
            -1, +1,
    ]);

    // Création d'un buffer dans la carte graphique.
    // Un buffer est un tableau de nombres.
    this._buffer = gl.createBuffer();
}

module.exports = Filter;
