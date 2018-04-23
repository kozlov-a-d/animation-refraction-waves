// import {TimelineMax} from 'gsap';
import * as THREE from 'three';
let OrbitControls = require('three-orbit-controls')(THREE);

import fragment from './shaders/refraction-waves.fragment.glsl';
import vertex from './shaders/refraction-waves.vertex.glsl';

// import {chunckPattern20} from './chunck.patterns.js';

export default class Animation {
    constructor() {
        // let self = this;
        this.container = document.querySelector('.js-animation');
        this.time = 0;
        this.size = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        this.textures = [
            THREE.ImageUtils.loadTexture( 'assets/images/img1.jpg' ),
            THREE.ImageUtils.loadTexture( 'assets/images/img2.jpg' ),
            THREE.ImageUtils.loadTexture( 'assets/images/img3.jpg' ),
            THREE.ImageUtils.loadTexture( 'assets/images/img4.jpg' ),
            THREE.ImageUtils.loadTexture( 'assets/images/img5.jpg' ),
            THREE.ImageUtils.loadTexture( 'assets/images/img6.jpg' ),
            THREE.ImageUtils.loadTexture( 'assets/images/img7.jpg' ),
            THREE.ImageUtils.loadTexture( 'assets/images/img8.jpg' ),
            THREE.ImageUtils.loadTexture( 'assets/images/img9.jpg' ),
        ]; 

        this.materials = {
            refractionWaves: new THREE.ShaderMaterial({
                side: THREE.DoubleSide,
                uniforms: {
                    time: { type: 'f', value: 0 },
                    // ratio: { type: 'f', value: 1 },
                    // waveLength: { type: 'f', value: 3 },
                    // mouse: { type: 'v2', value: new THREE.Vector2() },
                    // resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                    img1: {  type: 't', value: this.textures[0] }
                },
                // wireframe: true,
                vertexShader: vertex,
                fragmentShader: fragment,
            })
        }
        
        

        this.init();
        this.update();
    }

    init() {
        // create canvas
        this.canvas = document.createElement("canvas");
        this.canvas.classList.add('animation-refraction-waves');
        this.canvas.classList.add('fullscreen');
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        this.container.appendChild(this.canvas);

        // create THREE.js renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        this.renderer.setClearColor(0x151414);

        // create THREE.js scene
        this.scene = new THREE.Scene();

        // create THREE.js camera
        this.camera = new THREE.PerspectiveCamera(70, this.size.width / this.size.height, 0.01, 100);
        this.camera.position.set(0, 0, 1);

        // create THREE.js controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // let axesHelper = new THREE.AxesHelper( 5 );
        // this.scene.add( axesHelper );

        this.plane = new THREE.Mesh(new THREE.PlaneGeometry( 1,1, 64, 64 ),this.materials.refractionWaves);
        this.scene.add(this.plane);

        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize, false);
    }

    onWindowResize() {
        this.camera.aspect = this.size.width / this.size.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // fullscreen plane
        let dist = this.camera.position.z - this.plane.position.z;
        let planeHeight = 1;
        console.log(this.camera.fov);
        this.camera.fov = 180/Math.PI * Math.atan(planeHeight/(2*dist)) * 2; 
        console.log(this.camera.fov);
        if(this.size.width/this.size.height > 1){
            // this.plane.scale.x = this.plane.scale.y = this.size.width/this.size.height;
        }
    }


    draw() {
        // draw state
        
    }

    update() {
        this.time++;
        this.materials.refractionWaves.uniforms.time = this.time;
        this.draw();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.update.bind(this));
    }

}