import Vector from './Vector.js';
import Planet from './Planet.js';
import {ranges} from './Constants.js';
import {randomNumberBetween} from './Physics.js';

const {planetsNumber, positionRange, velocityRange, radiusRange, densityRange} = ranges;

export default class Simulation {
    /**
     * Construtor da simulação
     * @param {array} planets Planetas iniciais
     */
    constructor(planets = []) {
        this.planets = planets;
        if (this.planets.length === 0) {
            this.planets = this.getRandomPlanets(planetsNumber, positionRange, velocityRange, radiusRange, densityRange);
        }
        this.planets.forEach((planet) => {
            planet.simulation = this;
        });
    }

    /**
     * Retorna uma lista de planetas gerados pseudo-aleatoriamente conforme as constantes
     * @param {number} planetsNumber
     * @param {{x: {min: number, max: number}, y: {min: number, max: number}}} positionRange
     * @param {{x: {min: number, max: number}, y: {min: number, max: number}}} velocityRange
     * @param {{min: number, max: number}} radiusRange
     * @param {{min: number, max: number}} densityRange
     * @returns {[Planet, ...]}
     */
    getRandomPlanets(planetsNumber, positionRange, velocityRange, radiusRange, densityRange) {
        let planets = [];
        while(planetsNumber--) {
            const props = {
                position: new Vector(
                    randomNumberBetween(positionRange.x.min, positionRange.x.max),
                    randomNumberBetween(positionRange.y.min, positionRange.y.max)
                ),
                velocity: new Vector(
                    randomNumberBetween(velocityRange.x.min, velocityRange.x.max),
                    randomNumberBetween(velocityRange.y.min, velocityRange.y.max)
                ),
                radius: randomNumberBetween(radiusRange.min, radiusRange.max),
                density: randomNumberBetween(densityRange.min, densityRange.max)
            };
            planets.push(new Planet(props.position, props.velocity, props.radius, props.density));
        }
        return planets;
    }

    /**
     * Atualiza todos os planetas
     */
    update(timeDifference) {
        this.planets.forEach((planet) => planet.update(timeDifference));
    }
    /**
     * Renderiza todos os planetas
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        this.planets.forEach((planet) => planet.render(ctx));
    }
}
