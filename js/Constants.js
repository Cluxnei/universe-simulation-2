/**
 * Cria objeto que representa um intervalo com min e max
 * @param min {number} Valor mínimo
 * @param max {number} Valor máximo
 * @returns {{min: number, max: number}}
 */
const createRange = (min, max) => ({min, max});

/**
 * Propriedades do canvas
 * @type {{initialZoom: number, backgroundColor: string}}
 */
export const canvas = {
    backgroundColor: '#000',
    initialZoom: 0.9,
};
/**
 * Diferença de tempo, pra compensar a velocidade de calculo
 * Quanto mais próximo de 1 mais rápido a simulação roda
 * @type {number}
 */
export const timeDifference = 0.01;
/**
 * Valor da constante gravitacional
 * @type {number}
 */
export const gravitationConstant = 6.67e-11 * 10e10;

export const compositionGiveawayFactor = 0.3;

export const atomicRadiusScale = 10;

export const existingRadiusMin = 10 / atomicRadiusScale;

/**
 * Propriedades de intervalos para criação de estado inicial de simulação aleatória
 * @type {{planetsNumber: number, positionRange: {x: {min: number, max: number}, y: {min: number, max: number}}, maxAtomQuantity: number, velocityRange: {x: {min: number, max: number}, y: {min: number, max: number}}}}
 */
export const ranges = {
    planetsNumber: 3,
    positionRange: {
        x: createRange(-1000, 1000),
        y: createRange(-500, 500),
    },
    velocityRange: {
        x: createRange(0, 0),
        y: createRange(0, 0),
    },
    maxAtomQuantity: 1,
};
