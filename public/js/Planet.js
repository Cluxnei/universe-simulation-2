import Vector from './Vector.js';
import Composition from './Composition.js';
import {newtonGravitationLaw} from './Physics.js';
import {compositionGiveawayFactor, existingRadiusMin} from './Constants.js';

export default class Planet {
    /**
     * Constroi o planeta
     * @param {Vector} position
     * @param {Vector} velocity
     * @param {Composition} composition
     */
    constructor(position = new Vector, velocity = new Vector, composition = new Composition) {
        // Propriedades vetoriais
        this.position = position;
        this.velocity = velocity;
        this.acceleration = new Vector;
        this.forces = new Vector;
        // Propriedades escalares
        this.composition = composition;
        this.radius = this.composition.radius;
        this.mass = this.composition.mass;
        this.color = this.composition.color;
        this.removed = false;
        this.simulation = null;
    }

    /**
     * Atualiza as propriedades do planeta
     * @param {number} timeDifference
     */
    update(timeDifference) {
        let collidingPlanet = this.collidingPlanet();
        if(collidingPlanet){
            this.mergeWith(collidingPlanet, timeDifference);
        }
        if (this.composition.elements.length === 0) {
            this.removed = true;
            return this.simulation.removePlanet(this);
        }
        this.composition.update();
        this.radius = this.composition.radius;
        this.mass = this.composition.mass;
        this.color = this.composition.color;
        this.forces = this.computeTotalForces();
        this.acceleration = this.forces.copy().scale(1 / this.mass);
        this.velocity.add(this.acceleration.copy().scale(timeDifference));
        this.position.add(this.velocity.copy().scale(timeDifference));
    }
    collidingPlanet(){
        return this.simulation.planets.find((planet) => this.collidingWith(planet));
    }

    /**
     *  Retorna o se o planeta colide com outro
     * @param {Planet} planet
     * @returns {boolean}
     */
    collidingWith(planet){
        if(planet === this || planet.mass < this.mass || this.removed) {
            return false;
        }
        const distanceScalar = planet.position.copy().sub(this.position).magnitude();
        return distanceScalar < planet.radius + this.radius;
    }

    /**
     * Faz a junção das composições dos planetas que entraram em colisão
     * @param {Planet} planet
     * @param {number} timeDifference
     */
    mergeWith(planet, timeDifference) {
        let giveCompositionPercent = compositionGiveawayFactor * timeDifference;
        if (this.radius < existingRadiusMin) {
            giveCompositionPercent = 1;
        }
        planet.composition.upgrade(this.composition, giveCompositionPercent);
        this.composition.downgrade(giveCompositionPercent);
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
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    /**
     * Mostra uma modal com as informações do planeta
     */
    renderInformation() {
        if (!swal.getState().isOpen) {
            swal({
                title: 'Planet Information',
                text: this.toString(),
                width: '80%',
            });
        }
    }
    toString() {
        return `
            Position: ${this.position},
            Velocity: ${this.velocity},
            Acceleration: ${this.acceleration}
            Resulting Force: ${this.forces}
            Composition: ${this.composition}
            Radius: ${this.composition.radius}
            Mass: ${this.composition.mass}
            Color: ${this.composition.color}
        `;
    }

    getSnapshot() {
        return {
            position: this.position,
            radius: this.radius,
            color: this.color,
        };
    }
}
