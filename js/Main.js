import {initCanvas, updateCanvas} from './Canvas.js';
import {timeDifference} from './Constants.js';
import Simulation from './Simulation.js';

/**
 * Loop de atualização da física
 * @param {HTMLElement|HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {Simulation} simulation
 */
const loop = (canvas, ctx, simulation) => {
    updateCanvas(canvas);
    simulation.update(timeDifference);
    simulation.render(ctx);
    requestAnimationFrame(() => loop(canvas, ctx, simulation));
};

/**
 * Da o start na simulação
 */
const start = () => {
    const canvas = document.getElementById('canvas');
    initCanvas(canvas);
    const ctx = canvas.getContext('2d');
    const simulation = new Simulation();
    console.log('Simulation started');
    loop(canvas, ctx, simulation);
};

window.onload = start;
