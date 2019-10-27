"use strict";

const process_wrap = require("./process.wrap");

/**
 * Checks if colours should be enabled
 *
 * This function checks the reporting by Node if it's a TTY and also
 * adds command line options to control the colour printing.
 *
 * @return {boolean} if colours should be enabled
 */
module.exports = function checktty() {
	let isTTY = process_wrap.isTTY;

	let option_index = 0;
	for (let i = process_wrap.argv.length - 1; i >= 0; i--) {
		if (process_wrap.argv[i].search(/--colou?r/) > -1) {
			option_index = i;
			if (process_wrap.argv[i].search("=") === -1) {
				option_index++;
			}
			break;
		}
	}

	if (option_index > 0) {
		const option = process_wrap.argv[option_index].replace(/--colou?r=/, "");
		if (option === "never") {
			isTTY = false;
		}
		else if (option === "always") {
			isTTY = true;
		}
		else if (option !== "auto") {
			const start = (isTTY ? "\x1B[33m" : "");
			const end = (isTTY ? "\x1B[0m" : "");
			throw new SyntaxError(`${start}${process_wrap.argv[0]}: option '--color' requires an argument${end}`);
		}
	}

	return isTTY;
};
