import Element from './Element.js';
import Atom from './Atom.js';
import {colorMixer} from './Physics.js';

export default class Composition {
    constructor(elements = []) {
        /**
         * Atomos da tabela periódica
         * @type {Atom[]}
         */
        this.atoms = this.getAtomsFromPeriodicTable();
        /**
         * @type {Element[]}
         */
        this.elements = elements;
        if (this.elements.length === 0) {
            this.elements = this.getInitialElements();
        }
        this.color = this.computeColor();
        this.mass = this.computeMass();
        this.radius = this.computeRadius();
    }

    /**
     * Atualiza a composição
     */
    update() {
        this.elements = this.elements.sort(({quantity}, {quantity: qty}) => quantity - qty);
        this.color = this.computeColor();
        this.mass = this.computeMass();
        this.radius = this.computeRadius();
        this.quantity = this.computeQuantity();
    }

    /**
     * Calcula o raio com base nos elementos da composição
     * @returns {number}
     */
    computeRadius() {
        const sumRadius = (radius, {quantity, atom: {radius: r}}) => radius + (r * quantity);
        return this.elements.reduce(sumRadius, 0);
    }

    /**
     * Calcula o quantidade total de elementos
     * @returns {*}
     */
    computeQuantity() {
        const sumQuantity = (quantity, {quantity: q}) => quantity + q;
        return this.elements.reduce(sumQuantity, 0);
    }

    /**
     * Retorna o valor da composição inicial (um átomo de hidrogênio)
     * @returns {Element[]}
     */
    getInitialElements() {
        return [new Element(this.atoms[11], 10)];
    }

    /**
     * Calcula a massa
     * @returns {number} massa
     */
    computeMass() {
        const sumMass = (mass, {quantity, atom: {relativeMass}}) => (
            mass + (quantity * relativeMass)
        );
        return this.elements.reduce(sumMass, 0);
    }

    /**
     * Calcula a cor de acordo com a composição
     * @returns {string}
     */
    computeColor() {
        const firstColor = this.elements[0].atom.color;
        const mixColors = (color, {quantity, atom: {color: c}}) => (
            colorMixer(color, c, 1 - quantity / this.quantity)
        );
        return this.elements.reduce(mixColors, firstColor);
    }

    /**
     * Adiciona um certa porcentagem de uma composição dada ao planeta
     * @param {Composition} composition
     * @param {number} percent entre 0 e 1
     */
    upgrade(composition, percent) {
        let numberOfElementsToGive = Math.ceil(composition.quantity * percent);
        if (numberOfElementsToGive > composition.quantity) {
            numberOfElementsToGive = composition.quantity;
        }
        while (numberOfElementsToGive > 0) {
            for (let k = composition.elements.length - 1; k >= 0; k--) {
                const giveElementSymbol = composition.elements[k].atom.symbol;
                let quantityToGive = numberOfElementsToGive;
                if (quantityToGive > composition.elements[k].quantity) {
                    quantityToGive = composition.elements[k].quantity;
                }
                const indexOfElement = this.elements.findIndex(({atom: {symbol}}) => symbol === giveElementSymbol);
                if (indexOfElement === -1) {
                    this.elements.push(new Element(composition.elements[k].atom, quantityToGive));
                    numberOfElementsToGive -= quantityToGive;
                    continue;
                }
                this.elements[indexOfElement].quantity += quantityToGive;
                numberOfElementsToGive -= quantityToGive;
            }
        }
    }

    /**
     * Remove uma porcentagem da composição
     * @param {number} percent
     */
    downgrade(percent) {
        let numberOfElementsToDowngrade = Math.ceil(this.quantity * percent);
        while (numberOfElementsToDowngrade > 0) {
            for (let k = this.elements.length - 1; k >= 0; k--) {
                let downgradeQuantity = numberOfElementsToDowngrade;
                if (downgradeQuantity > this.elements[k].quantity) {
                    downgradeQuantity = this.elements[k].quantity;
                }
                this.elements[k].quantity -= downgradeQuantity;
                numberOfElementsToDowngrade -= downgradeQuantity;
            }
        }
        this.removeEmptyElements();
    }

    /**
     * Remove os elementos zerados
     */
    removeEmptyElements() {
        this.elements = this.elements.filter(({quantity}) => quantity > 0);
    }

    /**
     * Retorna um array com a tabela periódica
     * @returns {Atom[]}
     */
    getAtomsFromPeriodicTable() {
        return [
            new Atom('Hydrogen', '#63b9d5', 1, 'H', 1.00794, 53),
            new Atom('Helium', '#d1c991', 2, 'He', 4.002602, 31),
            new Atom('Lithium', '#4c6168', 3, 'Li', 6.941, 167),
            new Atom('Beryllium', '#c8c8c8', 4, 'Be', 9.012182, 112),
            new Atom('Boron', '#7d5353', 5, 'B', 10.811, 87),
            new Atom('Carbon', '#3b3b3b', 6, 'C', 12.0107, 67),
            new Atom('Nitrogen', '#2cc6b2', 7, 'N', 14.0067, 56),
            new Atom('Oxygen', '#6fec98', 8, 'O', 15.9994, 48),
            new Atom('Fluorine', '#ecc46f', 9, 'F', 18.9984032, 42),
            new Atom('Neon', '#be0086', 10, 'Ne', 20.1797, 38),
            new Atom('Sodium', '#e69d7a', 11, 'Na', 22.98976928, 190),
            new Atom('Magnesium', '#9e80ea', 12, 'Mg', 24.305, 145),
            new Atom('Aluminum', '#797979', 13, 'Al', 27, 118),
            new Atom('Silicon', '#4a4070', 14, 'Si', 28.0855, 111),
            new Atom('Phosphorus', '#d7463f', 15, 'P', 30.973762, 98),
            new Atom('Sulfur', '#375e7c', 16, 'S', 32.065, 88),
            new Atom('Chlorine', '#6d1d7b', 17, 'Cl', 35.453, 79),
            new Atom('Argon', '#9a3da5', 18, 'Ar', 39.948, 71),
            new Atom('Potassium', '#4d8946', 19, 'K', 39.0983, 243),
            new Atom('Calcium', '#f0f0f0', 20, 'Ca', 40.078, 194),
            new Atom('Scandium', '#5fbb77', 21, 'Sc', 44.955912, 184),
            new Atom('Titanium', '#5a5a5a', 22, 'Ti', 47.867, 176),
            new Atom('Vanadium', '#5f9ebb', 23, 'V', 50.9415, 171),
            new Atom('Chromium', '#a488b5', 24, 'Cr', 51.9961, 166),
            new Atom('Manganese', '#dc4a4a', 25, 'Mn', 54.938045, 161),
            new Atom('Iron', '#ab967d', 26, 'Fe', 55.845, 156),
            new Atom('Cobalt', '#4371e6', 27, 'Co', 58.933195, 152),
            new Atom('Nickel', '#bac395', 28, 'Ni', 58.6934, 149),
            new Atom('Copper', '#b95739', 29, 'Cu', 63.546, 145),
            new Atom('Zinc', '#b4b4b4', 30, 'Zn', 65.409, 142),
            new Atom('Gallium', '#39b975', 31, 'Ga', 69.723, 136),
            new Atom('Germanium', '#979273', 32, 'Ge', 72.64, 125),
            new Atom('Arsenic', '#738498', 33, 'As', 74.9216, 114),
            new Atom('Selenium', '#424242', 34, 'Se', 78.96, 103),
            new Atom('Bromine', '#d4753c', 35, 'Br', 79.904, 94),
            new Atom('Krypton', '#3ca0d4', 36, 'Kr', 83.798, 88),
            new Atom('Rubidium', '#d22c1f', 37, 'Rb', 85.4678, 265),
            new Atom('Strontium', '#ff9d29', 38, 'Sr', 87.62, 219),
            new Atom('Yttrium', '#b129ff', 39, 'Y', 88.90585, 212),
            new Atom('Zirconium', '#d6e43a', 40, 'Zr', 91.224, 206),
            new Atom('Niobium', '#75dceb', 41, 'Nb', 92.906, 198),
            new Atom('Molybdenum', '#8ba38c', 42, 'Mo', 95.94, 190),
            new Atom('Technetium', '#eea1e2', 43, 'Tc', 98, 183),
            new Atom('Ruthenium', '#563e32', 44, 'Ru', 101.07, 178),
            new Atom('Rhodium', '#88d17a', 45, 'Rh', 102.905, 173),
            new Atom('Palladium', '#9eabbe', 46, 'Pd', 106.42, 169),
            new Atom('Silver', '#dcdcdc', 47, 'Ag', 107.8682, 165),
            new Atom('Cadmium', '#5560c8', 48, 'Cd', 112.411, 161),
            new Atom('Indium', '#408d3c', 49, 'In', 114.818, 156),
            new Atom('Tin', '#b5a47c', 50, 'Sn', 118.71, 145),
            new Atom('Antimony', '#c6598c', 51, 'Sb', 121.76, 133),
            new Atom('Tellurium', '#827498', 52, 'Te', 128.6, 123),
            new Atom('Iodine', '#ff00fc', 53, 'I', 126.904, 115),
            new Atom('Xenon', '#7888ff', 54, 'Xe', 131.293, 108),
            new Atom('Caesium', '#ffd478', 55, 'Cs', 132.9054519, 298),
            new Atom('Barium', '#e99c9c', 56, 'Ba', 137.327, 253),
            new Atom('Lanthanum', '#8bdbbe', 57, 'La', 138.90547, 208),
            new Atom('Cerium', '#ff9329', 58, 'Ce', 140.116, 200),
            new Atom('Praseodymium', '#56e019', 59, 'Pr', 140.90765, 193),
            new Atom('Neodymium', '#65898d', 60, 'Nd', 144.242, 188),
            new Atom('Promethium', '#2ee99b', 61, 'Pm', 145, 185),
            new Atom('Samarium', '#bd6475', 62, 'Sm', 150.36, 180),
            new Atom('Europium', '#6c64bd', 63, 'Eu', 151.964, 177),
            new Atom('Gadolinium', '#6e1289', 64, 'Gd', 157.25, 174),
            new Atom('Terbium', '#359c50', 65, 'Tb', 158.92535, 171),
            new Atom('Dysprosium', '#447ee7', 66, 'Dy', 162.5, 156),
            new Atom('Holmium', '#e77d46', 67, 'Ho', 164.93, 154),
            new Atom('Erbium', '#bf4987', 68, 'Er', 167.259, 143),
            new Atom('Thulium', '#21426b', 69, 'Tm', 168.93421, 135),
            new Atom('Ytterbium', '#878750', 70, 'Yb', 173.04, 120),
            new Atom('Lutetium', '#d12c2c', 71, 'Lu', 174.967, 215),
            new Atom('Hafnium', '#91d12c', 72, 'Hf', 178.49, 195),
            new Atom('Tantalum', '#7f87Af', 73, 'Ta', 180.94788, 185),
            new Atom('Tungsten', '#2b6aa5', 74, 'W', 183.84, 247),
            new Atom('Rhenium', '#512f2f', 75, 'Re', 186.207, 206),
            new Atom('Osmium', '#307060', 76, 'Os', 190.23, 205),
            new Atom('Iridium', '#c9876a', 77, 'Ir', 192.217, 238),
            new Atom('Platinum', '#505008', 78, 'Pt', 195.084, 231),
            new Atom('Gold', '#edc474', 79, 'Au', 196.966569, 233),
            new Atom('Mercury', '#80a5ac', 80, 'Hg', 200.59, 225),
            new Atom('Thallium', '#ac8089', 81, 'Tl', 204.3833, 228),
            new Atom('Lead', '#3c7c66', 82, 'Pb', 207.2, 175),
            new Atom('Bismuth', '#ff0506', 83, 'Bi', 208.9804, 226),
            new Atom('Polonium', '#ffff00', 84, 'Po', 210, 222),
            new Atom('Astatine', '#00ff00', 85, 'At', 210, 222),
            new Atom('Radon', '#dae83a', 86, 'Rn', 222, 217),
            new Atom('Francium', '#ff6c00', 87, 'Fr', 223, 195),
            new Atom('Radium', '#00ffff', 88, 'Ra', 226, 180),
            new Atom('Actinium', '#424918', 89, 'Ac', 227, 180),
            new Atom('Thorium', '#aa3d82', 90, 'Th', 232.03806, 175),
            new Atom('Protactinium', '#3daa82', 91, 'Pr', 231.03588, 175),
            new Atom('Uranium', '#9cff00', 92, 'U', 238.02891, 175),
            new Atom('Neptunium', '#00aeff', 93, 'Np', 237, 175),
            // A partir daqui eu inventei os raios atomicos
            new Atom('Plutonium', '#ff9000', 94, 'Pu', 244, 299),
            new Atom('Americium', '#813349', 95, 'Am', 243, 300),
            new Atom('Curium', '#ff79d0', 96, 'Cm', 247, 301),
            new Atom('Berkelium', '#ae877e', 97, 'Bk', 247, 302),
            new Atom('Californium', '#8f3cb4', 98, 'Cf', 251, 303),
            new Atom('Einsteinium', '#86c4dc', 99, 'Es', 252, 304),
            new Atom('Fermium', '#bfdc86', 100, 'Fm', 257, 305),
            new Atom('Mendelevium', '#dc8686', 101, 'Md', 258, 306),
            new Atom('Nobelium', '#ffd965', 102, 'No', 259, 307),
            new Atom('Lawrencium', '#5c24a0', 103, 'Lr', 262, 307),
            new Atom('Rutherfordium', '#6b6675', 104, 'Rf', 261),
            new Atom('Dubnium', '#b05032', 105, 'Db', 262, 307),
            new Atom('Seaborgium', '#254987', 106, 'Sg', 266, 307),
            new Atom('Bohrium', '#9bafa0', 107, 'Bh', 264, 307),
            new Atom('Hassium', '#ff562d', 108, 'Hs', 277, 307),
            new Atom('Meitnerium', '#cdcd2c', 109, 'Mt', 268, 307),
            new Atom('Darmstadtium', '#3a7e48', 110, 'Ds', 271, 307),
            new Atom('Roentgenium', '#0000ff', 111, 'Rg', 272, 307),
            new Atom('Copernicium', '#aa4594', 112, 'Cn', 277, 307),
            new Atom('Nihonium', '#8f8f8f', 113, 'Nh', 284, 307),
            new Atom('Flerovium', '#2eede6', 114, 'Fl', 289, 307),
            new Atom('Moscovium', '#beaf64', 115, 'Mc', 288, 307),
            new Atom('Livermorium', '#f22e6a', 116, 'Lv', 292, 307),
            new Atom('Tennessine', '#70ea78', 117, 'Ts', 288, 307),
            new Atom('Oganesson', '#ff00b9', 118, 'Og', 294, 307),
            // Atomos ficticios
            new Atom('Bananium', '#ede674', 119, 'Bn', 301, 500),
            new Atom('GravityBlockium', '#3de6c3', 120, 'Gb', 311, 501),
            new Atom('BreakingBadium', '#309141', 121, 'Bb', 315, 400),
            new Atom('314159265359', '#4dc8e6', 122, 'Pi', 200, 190),
            new Atom('Sirnicanium', '#ff0000', 123, 'Sir', 500, 120),
            new Atom('Earthium', '#1177f5', 124, 'Ea', 600, 50),
            new Atom('Unbipentium', '#000000', 125, 'Ubp', 1000, 10)
        ];
    }
    toString() {
        return `
            Elements quantity: ${this.quantity}
            Elements: ${this.elements.reduce((acc, element) => acc + element, '')}
        `;
    }
};
