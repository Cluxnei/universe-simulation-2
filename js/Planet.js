import Vector from './Vector.js';
import {newtonGravitationLaw} from './Physics.js';

export default class Planet {
    /**
     * Constroi o planeta
     * @param position
     * @param velocity
     * @param radius
     * @param density
     */
    constructor(position = new Vector, velocity = new Vector, radius = 1, density = 1) {
        // Propriedades vetoriais
        this.position = position;
        this.velocity = velocity;
        this.acceleration = new Vector;
        this.forces = new Vector;
        // Propriedades escalares
        this.radius = radius;
        this.density = density;
        this.volume = 4 / 3 * Math.PI * this.radius ** 3;
        this.mass = this.density * this.volume;
        this.simulation = null;
    }

    /**
     * Atualiza as propriedades do planeta
     * @param {number} timeDifference
     */
    update(timeDifference) {
        this.forces = this.computeTotalForces();
        this.acceleration = this.forces.copy().scale(1 / this.mass);
        this.velocity.add(this.acceleration.copy().scale(timeDifference));
        this.position.add(this.velocity.copy().scale(timeDifference));
    }

    /**
     * Calcula a vetor da força de atração com um planeta
     * @param {Planet} otherPlanet
     * @returns {Vector} Vetor da força de atração
     */
    computeAttractionForce(otherPlanet){
        if(otherPlanet === this) {
            return new Vector;
        }
        const {position, mass} = otherPlanet;
        const distanceBetweenPlanets = position.copy().sub(this.position);
        const distanceBetweenPlanetsScalar = distanceBetweenPlanets.magnitude();
        const forceScalar = newtonGravitationLaw(this.mass, mass, distanceBetweenPlanetsScalar);
        return distanceBetweenPlanets.normalize().scale(forceScalar);
    }
    /**
     * Calcula a resultante da força de atração de todos os planetas com este
     * @returns {Vector|*} Resultante da força (soma de todas as forças de atração com os outros planetas)
     */
    computeTotalForces(){
        return this.simulation.planets.reduce((forces, planet) => forces.add(this.computeAttractionForce(planet)), new Vector);
    }

    /**
     * Renderiza o planeta no canvas
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        const {x, y} = this.position;
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, 360);
        // ctx.strokeStyle = '#f00';
        ctx.fillStyle = '#f00'; // this.color()
        // ctx.stroke()
        ctx.fill();
    }
}
