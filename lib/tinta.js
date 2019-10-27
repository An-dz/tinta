"use strict";

const hsl_to_rgb = require("./hsl_to_rgb");
const colours = require("./colour_codes");
const isTTY = require("./checktty")();

/**
 * Class representing an ANSI escape code for a colour
 */
class Colour extends String {
	/**
	 * @private
	 * @brief Append an ANSI code to the string
	 *
	 * Builds the ANSI escape code using the current string value to
	 * recursevily build a string with all codes. This is what enables
	 * the infinite prototype chain.
	 *
	 * @param {string} [code] ANSI code to append
	 *
	 * @return {Colour} Instance of Colour with composed ANSI code
	 */
	_get_colour(code) {
		const str = this.valueOf();
		const prev = (str.length > 0) ? `${str.substring(2, str.length - 1)};` : "";
		const esc_code = isTTY ? `\x1B[${prev}${code}m` : "";
		return (new Colour(esc_code));
	}

	/**
	 * @private
	 * @brief Set colour using any input
	 *
	 * Appends a custom colour ANSI code to the string whatever its
	 * input type. This is the private part of the fg and bg methods.
	 *
	 * @param {number|string} a First argument
	 * @param {number|string} [b] Second argument
	 * @param {number|string} [c] Third argument
	 * @param {string} [code] ANSI code that defines bg or fg
	 *
	 * @return {Colour} Instance of Colour with composed ANSI code
	 */
	_set_colour(a, b, c, code) {
		if (b === undefined && c === undefined) {
			if (typeof a === "string" && a[0] === "#") {
				return this._hex(a, code);
			}

			return this._palette(a, code);
		}

		if (a !== undefined && b !== undefined && c !== undefined) {
			if (b[b.length - 1] === "%" && c[c.length - 1] === "%") {
				return this._hsl(a, b, c, code);
			}

			return this._rgb(a, b, c, code);
		}

		throw new TypeError("This does not look like a valid hex, index, rgb or hsl colour");
	}

	/**
	 * @private
	 * @brief Set colour using RGB
	 *
	 * Appends an RGB colour to the ANSI code string.
	 *
	 * @param {number|string} r Red amount
	 * @param {number|string} g Green amount
	 * @param {number|string} b Blue amount
	 * @param {string} [code] ANSI code that defines bg or fg
	 *
	 * @return {Colour} Instance of Colour with composed ANSI code
	 */
	_rgb(red, green, blue, code) {
		const r = Number.parseInt(red, 10);
		const g = Number.parseInt(green, 10);
		const b = Number.parseInt(blue, 10);

		if (Number.isNaN(r)  ||
		    Number.isNaN(g)  ||
		    Number.isNaN(b)  ||
		    r < 0 || r > 255 ||
		    g < 0 || g > 255 ||
		    b < 0 || b > 255 )
		{
			throw new TypeError(`'(${red}, ${green}, ${blue})' is not a valid rgb colour`);
		}

		return this._get_colour(`${code};2;${r};${g};${b}`);
	}

	/**
	 * @private
	 * @brief Set colour using Hexadecimal RGB
	 *
	 * Appends an RGB colour to the ANSI code string using a Hex input.
	 *
	 * @param {number|string} hexa RGB value in hexadecimal notation
	 * @param {string} [code] ANSI code that defines bg or fg
	 *
	 * @return {Colour} Instance of Colour with composed ANSI code
	 */
	_hex(hexa, code) {
		let r;
		let g;
		let b;

		if (typeof hexa === "string" && hexa[0] === "#") {
			if (hexa.length === 7) {
				r = hexa.substring(1, 3);
				g = hexa.substring(3, 5);
				b = hexa.substring(5, 7);
			}
			else if (hexa.length === 4) {
				r = hexa.substring(1, 2).repeat(2);
				g = hexa.substring(2, 3).repeat(2);
				b = hexa.substring(3, 4).repeat(2);
			}
		}

		r = Number.parseInt(r, 16);
		g = Number.parseInt(g, 16);
		b = Number.parseInt(b, 16);

		if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
			throw new TypeError(`'${hexa}' is not a valid hexadecimal`);
		}

		return this._rgb(r, g, b, code);
	}

	/**
	 * @private
	 * @brief Set colour using HSL
	 *
	 * Appends an RGB colour to the ANSI code string using HSL input.
	 * (HSL = Hue Saturation Lightness)
	 *
	 * @param {number|string} h Hue angle
	 * @param {number|string} s Saturation amount
	 * @param {number|string} l Lightness amount
	 * @param {string} [code] ANSI code that defines bg or fg
	 *
	 * @return {Colour} Instance of Colour with composed ANSI code
	 */
	_hsl(h, s, l, code) {
		const hue = Number.parseInt(h, 10);
		const sat = Number.parseInt(s, 10);
		const lig = Number.parseInt(l, 10);

		if (Number.isNaN(hue)    ||
		    Number.isNaN(sat)    ||
		    Number.isNaN(lig)    ||
		    hue < 0 || hue > 360 ||
		    sat < 0 || sat > 100 ||
		    lig < 0 || lig > 100 )
		{
			throw new TypeError(`'(${h}, ${s}, ${l})' is not a valid hsl colour`);
		}

		const rgb = hsl_to_rgb(hue, sat, lig);

		return this._rgb(...rgb, code);
	}

	/**
	 * @private
	 * @brief Set colour using 8-bit palette
	 *
	 * Appends a colour of the 8-bit palette to the ANSI code string. 
	 *
	 * @param {number|string} index 8-bit palette index
	 * @param {string} [code] ANSI code that defines bg or fg
	 *
	 * @return {Colour} Instance of Colour with composed ANSI code
	 */
	_palette(index, code) {
		const idx = Number.parseInt(index, 10);

		if (Number.isNaN(idx) || idx < 0 || idx > 255) {
			throw new TypeError(`'${index}' is not a valid colour index`);
		}

		return this._get_colour(`${code};5;${idx}`);
	}

	/**
	 * @public
	 * @brief Set custom foreground colour
	 *
	 * Sets a foreground colour by any supported type.  
	 * Supported formats: RGB, HSL, Hex and 8-bit palette
	 *
	 * @param {number|string} a First argument
	 * @param {number|string} [b] Second argument
	 * @param {number|string} [c] Third argument
	 *
	 * @return {Colour} Instance of Colour with composed ANSI code
	 */
	fg(a, b, c) {
		return this._set_colour(a, b, c, "38");
	}

	/**
	 * @public
	 * @brief Set custom background colour
	 *
	 * Sets a background colour by any supported type.  
	 * Supported formats: RGB, HSL, Hex and 8-bit palette
	 *
	 * @param {number|string} a First argument
	 * @param {number|string} [b] Second argument
	 * @param {number|string} [c] Third argument
	 *
	 * @return {Colour} Instance of Colour with composed ANSI code
	 */
	bg(a, b, c) {
		return this._set_colour(a, b, c, "48");
	}

	/*
	 * @public
	 * @brief Alias for toString()
	 *
	 * This function is a convenience function for getting the escape
	 * code where you'd otherwise not get automatically.
	 *
	 * @return {string} The ANSI escape code string
	 */
	m() {
		return this.toString();
	}
}
	
// set getters for all colours
Object.entries(colours).forEach(entry => {
	const colour = entry[0];
	const code = entry[1];

	Object.defineProperty(Colour.prototype, colour, {
		get() {
			return this._get_colour(code);
		}
	});
});

// create extra methods for setting custom colours
const methods = ["rgb", "hsl", "hex", "palette"];

function create_method(method, key, code) {
	if (method === "rgb" || method === "hsl") {
		Object.defineProperty(Colour.prototype, key, {
			value: function (a, b, c) {
				return this[`_${method}`](a, b, c, code);
			}
		});
	}
	else {
		Object.defineProperty(Colour.prototype, key, {
			value: function (a) {
				return this[`_${method}`](a, code);
			}
		});
	}
}

methods.forEach(method => {
	create_method(method, `${method}`, "38");
	create_method(method, `fg_${method}`, "38");
	create_method(method, `${method}_fg`, "38");
	create_method(method, `fg${method[0].toUpperCase()}${method.substring(1)}`, "38");
	create_method(method, `${method}Fg`, "38");

	create_method(method, `bg_${method}`, "48");
	create_method(method, `${method}_bg`, "48");
	create_method(method, `bg${method[0].toUpperCase()}${method.substring(1)}`, "48");
	create_method(method, `${method}Bg`, "48");
});

// export an instance that allows you to build any ANSI escape code
module.exports = new Colour("");
