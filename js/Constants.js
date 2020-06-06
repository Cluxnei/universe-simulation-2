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
    initialZoom: 0.5,
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
/**
 * Propriedades de intervalos para criação de estado inicial de simulação aleatória
 * @type {{densityRange: {min: number, max: number}, radiusRange: {min: number, max: number}, planetsNumber: number, positionRange: {x: {min: number, max: number}, y: {min: number, max: number}}, velocityRange: {x: {min: number, max: number}, y: {min: number, max: number}}}}
 */
export const ranges = {
    planetsNumber: 5,
    positionRange: {
        x: createRange(-500, 500),
        y: createRange(-500, 500),
    },
    velocityRange: {
        x: createRange(-50, 50),
        y: createRange(-50, 50),
    },
    radiusRange: createRange(10, 50),
    densityRange: createRange(1, 10),
};
