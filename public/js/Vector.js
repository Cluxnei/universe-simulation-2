export default class Vector {
    /**
     * Construtor do Vetor
     * @param {number} x X do vetor
     * @param {number} y Y do vetor
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    /**
     * Adição de vetores
     * @param {Vector} vector Vetor a ser adicionado
     * @returns {Vector} Retorna o objeto
     */
    add({x, y}) {
        this.x += x;
        this.y += y;
        return this;
    }
    /**
     * Subtração de vetores
     * @param {Vector} vector Vetor a ser subtraido
     * @returns {Vector} Retorna o objeto
     */
    sub({x, y}) {
        this.x -= x;
        this.y -= y;
        return this;
    }
    /**
     * Multiplicação de vetores
     * Escala o Vetor
     * @param {number} scaleFactorX Fator de multiplicação X
     * @param {number|undefined} scaleFactorY Fator de multiplicação Y
     * @returns {Vector|*} vector Retorna o objeto
     */
    scale(scaleFactorX, scaleFactorY = undefined) {
        this.x *= scaleFactorX;
        this.y *= scaleFactorY || scaleFactorX;
        return this;
    }
    /**
     * Magnitude do vetor (tamanho)
     * @returns {number} Raiz quadrada da soma dos catetos elevados ao quadrado
     */
    magnitude() {
        return Math.hypot(this.x, this.y);
    }
    /**
     * Normaliza o Vetor
     * Deixa do menor tamanho mantendo a proporção
     * @returns {Vector} Retorna o objeto
     */
    normalize() {
        const magnitude = this.magnitude();
        this.x /= magnitude;
        this.y /= magnitude;
        return this;
    }

    /**
     * Copia o vetor
     * @returns {Vector}
     */
    copy() {
        return new Vector(this.x, this.y);
    }

    /**
     * Transforma o objeto em string
     * @returns {string}
     */
    toString() {
        return `[${this.x}, ${this.y}]`;
    }
};
