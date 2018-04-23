varying vec2 vUv;
varying vec4 vPosition;
uniform float time;
uniform float img1;

void main() {
    vUv = uv;
     gl_Position =  projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}