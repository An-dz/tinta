"use strict";

const test = require("ava");
const { testProp, fc } = require("ava-fast-check");
const td = require("testdouble");

test("TTY output has colour output", t => {
	td.replace("../process.wrap", {
		isTTY: true,
		argv: ["a", "b", "c"]
	});
	const checktty = require("../checktty");

	const context = checktty();

	t.true(context);
});

test("Not a TTY output has no colour output", t => {
	td.replace("../process.wrap", {
		isTTY: false,
		argv: ["a", "b", "c"]
	});
	const checktty = require("../checktty");

	const context = checktty();

	t.false(context);
});

testProp("'--colour never' disables colour output",
	[fc.constantFrom("u", ""), fc.constantFrom(" ", "=")],
	(UK_spell, separator) => {
		let b = `--colo${UK_spell}r`;
		let c = "c";
		if (separator === "=") {
			b += "=never";
		}
		else {
			c = "never";
		}

		td.replace("../process.wrap", {
			isTTY: true,
			argv: ["a", b, c],
		});
		const checktty = require("../checktty");

		const context = checktty();

		return context === false;
	}
);

testProp("'--colour always' enables colour output",
	[fc.constantFrom("u", ""), fc.constantFrom(" ", "=")],
	(UK_spell, separator) => {
		let b = `--colo${UK_spell}r`;
		let c = "c";
		if (separator === "=") {
			b += "=always";
		}
		else {
			c = "always";
		}

		td.replace("../process.wrap", {
			isTTY: false,
			argv: ["a", b, c],
		});
		const checktty = require("../checktty");

		const context = checktty();

		return context === true;
	}
);

testProp("'--colour auto' returns the default",
	[fc.constantFrom("u", ""), fc.constantFrom(" ", "="), fc.boolean()],
	(UK_spell, separator, isTYY) => {
		let b = `--colo${UK_spell}r`;
		let c = "c";
		if (separator === "=") {
			b += "=auto";
		}
		else {
			c = "auto";
		}

		td.replace("../process.wrap", {
			isTTY: isTYY,
			argv: ["a", b, c],
		});
		const checktty = require("../checktty");

		const context = checktty();

		return context === isTYY;
	}
);

test("Bad --colour argument on TTY throws an error", t => {
	td.replace("../process.wrap", {
		isTTY: true,
		argv: ["a", "--colour", "c"]
	});
	const checktty = require("../checktty");

	t.throws(() => checktty(), SyntaxError);
});

test("Bad --colour argument outside TTY throws ab error", t => {
	td.replace("../process.wrap", {
		isTTY: false,
		argv: ["a", "--colour", "c"]
	});
	const checktty = require("../checktty");

	t.throws(() => checktty(), SyntaxError);
});
