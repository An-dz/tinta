"use strict";

/**
 * Wrapper around the process global
 */
module.exports = {
	isTTY: process.stdout.isTTY,
	argv: process.argv,
};
