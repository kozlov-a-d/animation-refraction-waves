varying vec2 vUv;
varying vec4 vPosition;
uniform float time;
uniform sampler2D img1;
uniform float waveLength;
uniform vec2 mouse;
uniform float ratio;
uniform vec2 resolution;
uniform float type;
uniform float distortionOffest;
uniform float mouseFactor;

void main(void) {
    

    // float distortionOffest = 0.005; // смещение
    // float mouseFactor = 0.2; // влияние мышки при удалене от центра

    vec2 p = 7.68*(gl_FragCoord.xy/resolution.xy - vec2(0.5,1.0)) - vec2(mouse.x,-15);
	vec2 i = p;

	float c = 0.;
    for(int n = 0; n<4; n++){
        float t = ( 1.0 - ( 10.0 / float( n + 10 ) ) ) * time*0.3;
        float ix = i.x + mouse.x;
        float iy = i.y + mouse.y;
        i = vec2( cos( t - ix ) + sin( t + iy ), sin( t - iy ) + cos( t + ix ) ) + p;
        c += float( n ) / length( vec2( p.x / ( sin( t + i.x ) / 1.1 ), p.y / ( cos( t + i.y ) / 1.1 ) ) ) * 20.0;
    }
		
    c /= 190.;
    c = 1.8 - sqrt( c );
    
    vec4 tx = texture2D( img1, vec2(vUv.s + distortionOffest, vUv.t + distortionOffest)) * texture2D( img1, vec2( vUv.s + cos(c) * mouse.x * mouseFactor, vUv.t + cos(c) * mouse.y * mouseFactor ) ) * 0.25;
    vec4 newTx = vec4(tx.rgb, tx.a * 0.);
    vec4 ct = c * c * c * newTx;
    
    // waves
    if( type == 0.) {
        gl_FragColor = (ct - newTx * newTx - vec4( tx.rgb * 0.5, tx.a * vPosition.z ))*ratio;
        // gl_FragColor = (ct - newTx * newTx - vec4( tx.rgb * 0.5, tx.a * vPosition.z * c * 0.001 ));
    }

    // double eyes
    if( type == 1.) {
        gl_FragColor =  texture2D( img1, vec2(vUv.s, vUv.t)) * texture2D( img1, vec2(vUv.s + mouse.y*mouseFactor/10., vUv.t + mouse.x*mouseFactor/10.))*ratio;
    }
    
    // water
    if( type == 2.) {
        gl_FragColor =  texture2D( img1, vec2(vUv.s + distortionOffest, vUv.t + distortionOffest)) 
        * ( ( texture2D( img1, vec2( vUv.s + cos(c)*mouse.x*mouseFactor, vUv.t + cos(c)*mouse.y*mouseFactor ) ) * 0.25 ) / 4. )  * 15.*ratio;
    }

    // shadow wave
    if( type == 3.) {

        gl_FragColor =  texture2D( img1, vec2(vUv.s, vUv.t)) * texture2D( img1, vec2(vUv.s +cos(c)*0.05, vUv.t +cos(c)*0.05)) *1.6*ratio;
        // * texture2D( img1, vec2(vUv.s + sin(time/3.)*cos(c) *mouse.y*mouseFactor, vUv.t + sin(time/3.)*cos(c)*mouse.x*mouseFactor));
    }

    
}