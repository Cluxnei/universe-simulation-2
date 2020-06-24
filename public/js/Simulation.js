import Vector from './Vector.js';
import Planet from './Planet.js';
import {ranges} from './Constants.js';
import {randomNumberBetween} from './Physics.js';
import Composition from './Composition.js';

const {planetsNumber, positionRange, velocityRange} = ranges;

export default class Simulation {
    /**
     * Construtor da simulação
     * @param {array} planets Planetas iniciais
     */
    constructor(planets = []) {
        this.planets = planets;
        if (this.planets.length === 0) {
            this.planets = this.getRandomPlanets(planetsNumber, positionRange, velocityRange);
        }
        this.paused = false;
        this.information = null;
        this.planets.forEach((planet) => {
            planet.simulation = this;
        });
    }

    /**
     * Copia a simulação
     * @returns {Simulation}
     */
    copy() {
        return new Simulation(this.planets);
    }

    /**
     * Retorna uma lista de planetas gerados pseudo-aleatoriamente conforme as constantes
     * @param {number} planetsNumber
     * @param {{x: {min: number, max: number}, y: {min: number, max: number}}} positionRange
     * @param {{x: {min: number, max: number}, y: {min: number, max: number}}} velocityRange
     * @returns {[Planet, ...]}
     */
    getRandomPlanets(planetsNumber, positionRange, velocityRange) {
        let planets = [];
        while (planetsNumber--) {
            const props = {
                position: new Vector(
                    randomNumberBetween(positionRange.x.min, positionRange.x.max),
                    randomNumberBetween(positionRange.y.min, positionRange.y.max)
                ),
                velocity: new Vector(
                    randomNumberBetween(velocityRange.x.min, velocityRange.x.max),
                    randomNumberBetween(velocityRange.y.min, velocityRange.y.max)
                ),
                composition: Composition.getRandom(),
            };
            planets.push(new Planet(props.position, props.velocity, props.composition));
        }
        return planets;
    }

    /**
     * Atualiza todos os planetas
     */
    update(timeDifference) {
        if (this.paused) {
            return;
        }
        this.planets.forEach((planet) => planet.update(timeDifference));
    }

    /**
     * Renderiza todos os planetas
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        this.planets.forEach((planet) => planet.render(ctx));
        if (this.paused && this.information) {
            this.information.renderInformation();
            this.information = null;
        }
    }

    /**
     * Procura na simulação o planeta clicado
     * @param position
     * @param zoom
     */
    checkPlanetClick(position, zoom) {
        this.information = this.planets.find(({position: p, radius}) => this.isInsidePlanet(position, p, radius, zoom));
    }

    /**
     * Verifica se o click foi dentro do planeta
     * @param {Vector} positionA
     * @param {Vector} planetPosition
     * @param {number} radius
     * @param {number} zoom
     * @returns {boolean}
     */
    isInsidePlanet(positionA, planetPosition, radius, zoom) {
        return positionA.copy().sub(planetPosition).magnitude() <= radius * zoom;
    }

    /**
     * Remove um planeta da simulação
     * @param planet
     */
    removePlanet(planet) {
        this.planets = this.planets.filter((p) => p !== planet);
    }

    getSnapshot() {
        const planets = this.planets.map((planet) => planet.getSnapshot());
        return {planets};
    }
}
