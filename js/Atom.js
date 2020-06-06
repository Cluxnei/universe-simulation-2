export default class Atom {
    constructor(name, color, number, symbol, relativeMass, radius) {
        this.name = name;
        this.color = color;
        this.number = number;
        this.symbol = symbol;
        this.relativeMass = relativeMass;
        this.radius = radius;
    }
    toString() {
        return `${this.name} (${this.symbol})`;
    }
}
