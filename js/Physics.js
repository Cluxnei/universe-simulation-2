import {gravitationConstant} from './Constants.js';

/**
 *
 * @param m1 {number} massa 1
 * @param m2 {number} massa 2
 * @param distance {number} Distancia euclidiana
 * @returns {number} atração gravitacional
 */
export const newtonGravitationLaw = (m1, m2, distance) => gravitationConstant * (m1 * m2 / (distance * distance));

/**
 * Valor pseudo-aleatório dentro do intervalo
 * @param min {number} Valor mínimo
 * @param max {number} Valor máximo
 * @returns {number}
 */
export const randomNumberBetween = (min, max) => Math.random() * (max - min) + min;
