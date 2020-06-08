import {initCanvas, updateCanvas} from './Canvas.js';
import {timeDifference} from './Constants.js';
import Simulation from './Simulation.js';

let paused = false;
let menuAnimation = true;
let isComputing = false;
let preComputedSimulationStates = [];
let computedTimeInterval;

/**
 * Pausa a simulação
 */
const pauseSimulation = () => {
    paused = true;
    console.log('Simulation Paused');
};
/**
 * Resume a simulação pausada
 */
const resumeSimulation = () => {
    paused = false;
    console.log('Simulation Resumed');
};

/**
 * Loop de atualização da física
 * @param {HTMLElement|HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {Simulation} simulation
 */
const loopRealtime = (canvas, ctx, simulation) => {
    updateCanvas(canvas);
    simulation.paused = paused;
    simulation.update(timeDifference);
    simulation.render(ctx);
    requestAnimationFrame(() => loopRealtime(canvas, ctx, simulation));
};

const renderPreComputedSimulation = (canvas, ctx, i = 0) => {
    if (i >= preComputedSimulationStates.length) {
        return console.log('Render finished');
    }
    updateCanvas(canvas);
    preComputedSimulationStates[i].render(ctx);
    if (!paused) {
        i++;
    }
    requestAnimationFrame(() => renderPreComputedSimulation(canvas, ctx, i))
};

/**
 * Da o start na simulação
 */
const startSimulation = (realTime = true) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const simulation = new Simulation([]);
    if (realTime) {
        removeMenu();
        showPauseButton();
        return startRealtimeSimulation(canvas, ctx, simulation);
    }
    showPreComputedTime();
    setTimeout(() => startPreComputedSimulation(simulation), 100);
    setTimeout(showComputedTimeWacher, 110);
};

const showComputedTimeWacher = () => {
    computedTimeInterval = setInterval(() => {
        const time = (preComputedSimulationStates.length * timeDifference / 60).toFixed(2);
        document.getElementById('pre-computed-time-watcher').innerText = `${time}s`;
    }, 500);
};

const loopPreComputed = (simulation) => {
    simulation.update(timeDifference);
    return simulation.copy();
}

const startPreComputedSimulation = async (simulation) => {
    isComputing = true;
    let computingInterval = setInterval(() => {
        if (!isComputing) {
            clearInterval(computedTimeInterval);
            return clearInterval(computingInterval);
        }
        preComputedSimulationStates.push(loopPreComputed(simulation));
    }, 1);
};

const startRealtimeSimulation = (canvas, ctx, simulation) => {
    initCanvas(canvas);
    loopRealtime(canvas, ctx, simulation);
};

const removeMenu = () => {
    document.querySelector('.main').style.display = 'none';
};

const showPauseButton = () => {
    document.getElementById('pause-button').style.display = 'block';
};

const handlePlayPreComputedSimulationButtonClick = () => {
    removeMenu();
    showPauseButton();
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    initCanvas(canvas);
    renderPreComputedSimulation(canvas, ctx);
};

const handlePreComputedStopButtonClick = () => {
    isComputing = false;
    document.querySelector('#pre-computed-timer div').style.display = 'none';
    const stopButton = document.getElementById('pre-computed-stop-button');
    stopButton.removeEventListener('click', (
        handlePreComputedStopButtonClick
    ));
    stopButton.innerHTML = '<i class="fa fa-2x fa-play-circle"></i>play computed simulation';
    stopButton.addEventListener('click', handlePlayPreComputedSimulationButtonClick);
};

const handleRealTimeModeButtonPress = () => {
    menuAnimation = false;
    startSimulation();
};

const handlePreComputedModeButtonPress = () => {
    menuAnimation = false;
    startSimulation(false);
};

const handlePauseButtonPress = function () {
    const icon = this.firstChild;
    if (icon.classList.contains('fa-pause')) {
        pauseSimulation();
        icon.classList.remove('fa-pause');
        return icon.classList.add('fa-play');
    }
    resumeSimulation();
    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');
};

const showPreComputedTime = () => {
    document.querySelector('.choose-mode').style.display = 'none';
    document.getElementById('pre-computed-timer').style.display = '';
    document.getElementById('pre-computed-stop-button').addEventListener('click', (
        handlePreComputedStopButtonClick
    ));
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

        let sprite = new THREE.TextureLoader().load('img/star.png');
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
    document.getElementById('real-time-mode').addEventListener('click', (
        handleRealTimeModeButtonPress
    ));
    document.getElementById('pre-computed-mode').addEventListener('click', (
        handlePreComputedModeButtonPress
    ));
    document.getElementById('pause-button').addEventListener('click', handlePauseButtonPress);
};
