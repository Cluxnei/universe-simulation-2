import {timeDifference} from './Constants.js';
import Simulation from './Simulation.js';
import {canvas} from './Constants.js';

const {initialZoom} = canvas;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const controls = new THREE.OrbitControls(camera, renderer.domElement);

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
 * @param {Simulation} simulation
 */
let d = true;
const loopRealtime = (simulation) => {
    simulation.paused = paused;
    simulation.update(timeDifference);
    simulation.planets.forEach((planet) => {
        planet.sphere.position.x = planet.position.x;
        planet.sphere.position.y = planet.position.y;
        planet.sphere.radius = planet.radius;
        planet.sphere.colorsNeedUpdate = true;
    });
    camera.position.x = 17.44;
    camera.position.z = -100.08;
    camera.position.z = 5.38;
    camera.zoom = initialZoom;
    renderer.render(scene, camera);
    requestAnimationFrame(() => loopRealtime(simulation));
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
    document.body.appendChild(renderer.domElement);
    const simulation = new Simulation([]);
    if (realTime) {
        removeMenu();
        showPauseButton();
        return startRealtimeSimulation(simulation);
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

const startRealtimeSimulation = (simulation) => {
    simulation.planets.forEach((planet) => {
        scene.add(planet.sphere);
    });
    loopRealtime(simulation);
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

window.onload = () => {
    document.getElementById('real-time-mode').addEventListener('click', (
        handleRealTimeModeButtonPress
    ));
    document.getElementById('pre-computed-mode').addEventListener('click', (
        handlePreComputedModeButtonPress
    ));
    document.getElementById('pause-button').addEventListener('click', handlePauseButtonPress);
};
