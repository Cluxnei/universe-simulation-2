import {initCanvas, updateCanvas} from './Canvas.js';

let menuAnimation = true;

const socket = io();

/**
 * Da o start na simulação
 */
const startSimulation = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    removeMenu();
    initCanvas(canvas);
    socket.on('render', (simulation) => {
        updateCanvas(canvas);
        for (const {position: {x, y}, color, radius} of simulation.planets) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 360);
            ctx.fillStyle = color;
            ctx.fill();
        }
    });
    socket.emit('start');
};

const removeMenu = () => {
    document.querySelector('.main').style.display = 'none';
};
const handleRealTimeModeButtonPress = () => {
    menuAnimation = false;
    startSimulation();
};

const startMenuAnimation = () => {
    let scene, camera, renderer, stars, starGeo, star;

    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 1;
        camera.rotation.x = Math.PI / 2;
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.insertBefore(renderer.domElement, document.body.firstChild);
        starGeo = new THREE.Geometry();
        for (let i = 0; i < 6000; i++) {
            star = new THREE.Vector3(
                Math.random() * 600 - 300,
                Math.random() * 600 - 300,
                Math.random() * 600 - 300
            );
            star.velocity = 0;
            star.acceleration = 0.02;
            starGeo.vertices.push(star);
        }

        let sprite = new THREE.TextureLoader().load('public/img/star.png');
        let starMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.7,
            map: sprite
        });

        stars = new THREE.Points(starGeo, starMaterial);
        scene.add(stars);

        window.addEventListener("resize", onWindowResize, false);

        animate();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        starGeo.vertices.forEach(p => {
            p.velocity += p.acceleration
            p.y -= p.velocity;

            if (p.y < -200) {
                p.y = 200;
                p.velocity = 0;
            }
        });
        starGeo.verticesNeedUpdate = true;
        stars.rotation.y += 0.002;

        renderer.render(scene, camera);
        if (menuAnimation) {
            requestAnimationFrame(animate);
        } else {
            document.querySelector('canvas').remove();
        }
    }

    init();
};

window.onload = () => {
    startMenuAnimation();
    document.getElementById('start').addEventListener('click', (
        handleRealTimeModeButtonPress
    ));
};
