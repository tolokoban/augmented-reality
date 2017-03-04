attribute vec2 attPosition;

varying vec2 varPosition;

void main() {  
  varPosition = attPosition;
  gl_Position = vec4( attPosition, 0, 1 );
}
