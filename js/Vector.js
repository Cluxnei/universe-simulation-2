export default class Vector {
    /**
     * Construtor do Vetor
     *
     * @param {number} x X do vetor
     * @param {number} y Y do vetor
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    /**
     * Adição de vetores
     *
     * @param {Vector} vector Vetor a ser adicionado
     *
     * @returns {this} Retorna o objeto
     */
    add({x, y}) {
        this.x += x;
        this.y += y;
        return this;
    }
    /**
     * Subtração de vetores
     *
     * @param {Vector} vector Vetor a ser subtraido
     *
     * @returns {this} Retorna o objeto
     */
    sub({x, y}) {
        this.x -= x;
        this.y -= y;
        return this;
    }
    /**
     * Multiplicação de vetores
     * Escala o Vetor
     *
     * @param {number} scaleFactorX Fator de multiplicação X
     * @param {number|undefined} scaleFactorY Fator de multiplicação Y
     *
     * @returns {Vector} Retorna o objeto
     */
    scale(scaleFactorX, scaleFactorY = undefined) {
        this.x *= scaleFactorX;
        this.y *= scaleFactorY || scaleFactorX;
        return this;
    }
    /**
     * Magnitude do vetor (tamanho)
     *
     * @returns {number} Raiz quadrada da soma dos catetos elevados ao quadrado
     */
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    /**
     * Normaliza o Vetor
     * Deixa do menor tamanho mantendo a proporção
     *
     * @returns {Vector} Retorna o objeto
     */
    normalize() {
        const magnitude = this.magnitude();
        this.x /= magnitude;
        this.y /= magnitude;
        return this;
    }
};
