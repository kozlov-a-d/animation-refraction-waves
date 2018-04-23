// import {TimelineMax} from 'gsap';
import * as THREE from 'three';
let OrbitControls = require('three-orbit-controls')(THREE);

import fragment from './shaders/refraction-waves.fragment.glsl';
import vertex from './shaders/refraction-waves.vertex.glsl';
import { TimelineMax } from 'gsap';

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

        this.animating = false;
        this.counter = 0;

        this.destination = {x:0,y:0};  // mouse destination

        this.textures = [
            THREE.ImageUtils.loadTexture( 'assets/images/img1.jpg' ),
            THREE.ImageUtils.loadTexture( 'assets/images/img2.jpg' ),
            THREE.ImageUtils.loadTexture( 'assets/images/img3.jpg' ),
            THREE.ImageUtils.loadTexture( 'assets/images/img4.jpg' ),
            THREE.ImageUtils.loadTexture( 'assets/images/img5.jpg' ),
        ];
        let tex1 = new THREE.ImageUtils.loadTexture( 'assets/images/img1.jpg' );
        

        console.log(this.textures);
        
        this.materials = {
            refractionWaves: new THREE.ShaderMaterial({
                side: THREE.DoubleSide,
                uniforms: {
                    time: { type: 'f', value: 0 },
                    ratio: { type: 'f', value: 1 },
                    waveLength: { type: 'f', value: 3 },
                    mouse: { type: 'v2', value: new THREE.Vector2() },
                    resolution: { type: 'v2', value: new THREE.Vector2(this.size.width, this.size.height) },
                    img1: {  type: 't', value: tex1 }
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
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        window.addEventListener('click', this.onClick.bind(this), false);
    }

    onWindowResize() {
        this.size.width = window.innerWidth;
        this.size.height = window.innerHeight;
        this.renderer.setSize(this.size.width, this.size.height);
        this.camera.aspect = this.size.width / this.size.height;

        // fullscreen plane
        let dist = this.camera.position.z - this.plane.position.z;
        let planeHeight = 1;
        this.camera.fov = 180/Math.PI * Math.atan(planeHeight/(2*dist)) * 2; 
        if(this.size.width/this.size.height > 1){
            this.plane.scale.x = this.plane.scale.y = this.size.width/this.size.height *1.15;
        }

        this.camera.updateProjectionMatrix();
    }

    onMouseMove(e) {
        let x = (e.clientX-window.innerWidth/2)/(window.innerWidth/2);
        let y = (e.clientY-window.innerHeight/2)/(window.innerHeight/2);
        this.destination.x = y;
        this.destination.y = x;
    }

    onClick() {
        if(this.animating) return;
        this.animating = 1;
        this.counter = (this.counter +1) % this.textures.length;
        let tl = new TimelineMax({onComplete: function() {this.animating = 0;}.bind(this)});
        tl
        .to(this.materials.refractionWaves.uniforms.waveLength,0.5,{value: 22})
        .to(this.materials.refractionWaves.uniforms.ratio,0.5,{value: 0, onComplete: function() {
            this.materials.refractionWaves.uniforms.img1.value = this.textures[this.counter];
        }.bind(this)},0)
        .to(this.materials.refractionWaves.uniforms.ratio,0.5,{value: 1})
        .to(this.materials.refractionWaves.uniforms.waveLength,0.5,{value: 3},0.5);
    }


    draw() {
        // draw state
        this.materials.refractionWaves.uniforms.time.value = this.time;
        this.materials.refractionWaves.uniforms.mouse.value.x += (this.destination.x - this.materials.refractionWaves.uniforms.mouse.value.x)*0.05;
        this.materials.refractionWaves.uniforms.mouse.value.y += (this.destination.y - this.materials.refractionWaves.uniforms.mouse.value.y)*0.05;
        this.renderer.render(this.scene, this.camera);
    }

    update() {
        this.time++;
        this.draw();
        requestAnimationFrame(this.update.bind(this));
    }

}