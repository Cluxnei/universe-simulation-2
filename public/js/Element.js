export default class Element {
    constructor(atom, quantity = 1) {
        this.atom = atom;
        this.quantity = quantity;
    }
    toString() {
        return `${this.quantity} atom(s) of ${this.atom}`;
    }
}
