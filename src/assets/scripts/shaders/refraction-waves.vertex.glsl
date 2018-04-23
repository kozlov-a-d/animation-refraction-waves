uniform float time;
uniform float waveLength;
uniform sampler2D img1;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 vUv;
varying vec4 vPosition;

void main() {
    vUv = uv;

    lowp float vWave = sin( time/40. + (position.x + position.y)*waveLength );

    //gl_Position =  projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position =  projectionMatrix * modelViewMatrix * vec4(position.x + mouse.y*0.04, position.y + mouse.x*-0.04, vWave*0.04, 1.0); 
}