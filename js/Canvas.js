import Vector from './Vector.js';
import {canvas} from './Constants.js';

const {backgroundColor, initialZoom} = canvas;

const getMousePos = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    const [w, h] = [canvas.clientWidth / 2, canvas.clientHeight / 2];
    return new Vector(event.clientX - rect.left - w - canvas.positionX, event.clientY - rect.top - h - canvas.positionY);
};

/**
 * Inicia o canvas, com algumas funções úteis
 * @param {HTMLElement|HTMLCanvasElement} canvas
 * @param {Simulation} simulation Simulação
 * @returns {HTMLElement|HTMLCanvasElement}
 */
export const initCanvas = (canvas, simulation) => {
    canvas.style.display = '';
    canvas.zoom = initialZoom || 1;
    canvas.positionX = 0;
    canvas.positionY = 0;
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas, false);
    canvas.addEventListener('mousemove', (evt) => {
        if (!canvas.dragging) {
            return;
        }
        canvas.positionX = (canvas.positionX || 0) + evt.movementX;
        canvas.positionY = (canvas.positionY || 0) + evt.movementY;
    });
    canvas.addEventListener('mousedown', () => {
        canvas.dragging = true;
    });
    canvas.addEventListener('mouseup', () => {
        canvas.dragging = false;
    });
    canvas.addEventListener('wheel', (evt) => {
        canvas.zoom -= evt.deltaY / 1000 * canvas.zoom;
    });
    canvas.addEventListener('click', (evt) => simulation.checkPlanetClick(getMousePos(canvas, evt), canvas.zoom));
    resizeCanvas();
    return canvas;
};

/**
 * Atualiza o canvas (limpa)
 * @param {HTMLElement|HTMLCanvasElement} canvas
 */
export const updateCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    const zoom = canvas.zoom;
    const x = canvas.positionX || 0;
    const y = canvas.positionY || 0;
    ctx.resetTransform();
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.translate(canvas.clientWidth / 2 + x, canvas.clientHeight / 2 + y);
    ctx.scale(zoom, zoom);
};
