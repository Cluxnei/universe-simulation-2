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

/**
 * Mixa dois canais de cores
 * @param {number|string} colorChannelA
 * @param {number|string} colorChannelB
 * @param {number} amountToMix
 * @returns {number}
 */
const colorChannelMixer = (colorChannelA, colorChannelB, amountToMix) => {
    const channelA = parseInt(colorChannelA, 10) * amountToMix;
    const channelB = parseInt(colorChannelB, 10) * (1 - amountToMix);
    return parseInt((channelA + channelB).toString(), 10);
}
/**
 * Converte uma cor hexadecimal pra rgb
 * @param {string} hex
 * @returns {array|null}
 */
export const hexToRgb = (hex) => {
    const cutHex = (hex) => (hex.charAt(0) === '#') ? hex.substring(1, 7) : hex;
    hex = cutHex(hex);
    const hexToR = (hex) => parseInt(hex.substring(0, 2), 16);
    const hexToG = (hex) => parseInt(hex.substring(2, 4), 16);
    const hexToB = (hex) => parseInt(hex.substring(4, 6), 16);
    return [hexToR(hex), hexToG(hex), hexToB(hex)];
}

/**
 * Mixa duas cores
 * @param {array|string} rgbA
 * @param {array|string} rgbB
 * @param {number} amountToMix Porcentagem de mixagem de 0 à 1
 * @returns {string} cor mixada
 */
export const colorMixer = (rgbA, rgbB, amountToMix) => {
    if (typeof rgbA === 'string') {
        if (rgbA.includes('#')) {
            rgbA = hexToRgb(rgbA);
        } else {
            rgbA = rgbA.substring(4, rgbA.length - 1).replace(/ /g, '').split(',');
        }
    }
    if (typeof rgbB === 'string') {
        if (rgbB.includes('#')) {
            rgbB = hexToRgb(rgbB);
        } else {
            rgbB = rgbB.substring(4, rgbB.length - 1).replace(/ /g, '').split(',');
        }
    }
    const r = colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
    const g = colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
    const b = colorChannelMixer(rgbA[2], rgbB[2], amountToMix);
    return `rgb(${r},${g},${b})`;
}
