import {initCanvas, updateCanvas} from './Canvas.js';
import {timeDifference} from './Constants.js';
import Simulation from './Simulation.js';

let paused = false;

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
const loop = (canvas, ctx, simulation) => {
    updateCanvas(canvas);
    simulation.paused = paused;
    simulation.update(timeDifference);
    simulation.render(ctx);
    requestAnimationFrame(() => loop(canvas, ctx, simulation));
};

/**
 * Da o start na simulação
 */
const startSimulation = (realTime = true) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const simulation = new Simulation([], realTime);
    removeMenu();
    showPauseButton();
    initCanvas(canvas, simulation);
    loop(canvas, ctx, simulation);
    console.log('Simulation started');
};

const removeMenu = () => {
    document.querySelector('.main').style.display = 'none';
};

const showPauseButton = () => {
    document.getElementById('pause-button').style.display = 'block';
};

window.onload = () => {
    document.getElementById('real-time-mode').addEventListener('click', () => startSimulation(true));
    document.getElementById('pre-computed-mode').addEventListener('click', () => startSimulation(false));
    document.getElementById('pause-button').addEventListener('click', function() {
        const icon = this.firstChild;
        if (icon.classList.contains('fa-pause')) {
            pauseSimulation();
            icon.classList.remove('fa-pause');
            return icon.classList.add('fa-play');
        }
        resumeSimulation();
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    });
};
