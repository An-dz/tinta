"use strict";

/**
 * @brief Convert HSL to RGB
 *
 * Converts an HSL colour to RGB, this uses an optimised algorithm that
 * is available on Wikipedia.
 *
 * @param {number} hue Any valid angle between [0, 360]
 * @param {number} saturation Any valid value between [0, 100]
 * @param {number} lightness Any valid value between [0, 100]
 *
 * @return {array} with R, G and B components [0-255]
 */
module.exports = function hsl_to_rgb(hue, saturation, lightness) {
	saturation = saturation / 100;
	lightness = lightness / 100;

	const a = saturation * Math.min(lightness, 1 - lightness);
	const f = n => {
		const k = (n + (hue / 30)) % 12;
		return lightness - (a * Math.max(-1, Math.min(k - 3, 9 - k, 1)));
	};

	return [
		(f(0) * 255).toFixed(0),
		(f(8) * 255).toFixed(0),
		(f(4) * 255).toFixed(0),
	];
};
