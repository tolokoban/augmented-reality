precision mediump float;

// Size of a pixel.
uniform float uniW;
uniform float uniH;

uniform sampler2D uniTexture;
varying vec2 varPosition;

const vec4 FRONT = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 BACK = vec4(1.0, 1.0, 1.0, 0.0);

vec4 c( float x, float y ) {
  return texture2D( uniTexture, vec2( x, y ) );
}


//======================================================================
void main() {
  float x = (varPosition.x + 1.0) / 2.0;
  float y = (varPosition.y + 1.0) / 2.0;
  vec4 color = c( x, y );
  float len2 = color.r * color.r + color.g * color.g + color.b * color.b;
  if( len2 > 0.2 ) {
    gl_FragColor = BACK;
    return;
  }

  gl_FragColor = FRONT;

  color = c( x - uniW, y );
  len2 = color.r * color.r + color.g * color.g + color.b * color.b;
  if( len2 > .8 ) return;

  color = c( x + uniW, y );
  len2 = color.r * color.r + color.g * color.g + color.b * color.b;
  if( len2 > .8 ) return;

  color = c( x, y - uniH );
  len2 = color.r * color.r + color.g * color.g + color.b * color.b;
  if( len2 > .8 ) return;

  color = c( x, y + uniH );
  len2 = color.r * color.r + color.g * color.g + color.b * color.b;
  if( len2 > .8 ) return;

  gl_FragColor = BACK;
}
