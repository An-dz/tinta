"use strict";

const test = require("ava");
const fc = require("fast-check");
const td = require("testdouble");

test.beforeEach(t => {
	t.context.checktty = td.replace("../lib/checktty");
	t.context.hsl_to_rgb = td.replace("../lib/hsl_to_rgb");

	td.when(t.context.checktty()).thenReturn(true);

	t.context.colour = require("../lib/tinta");
});

test("The base class returns empty", t => {
	const context = t.context.colour.m();

	t.is(context, "");
});

test("Colour getter returns the expected code", t => {
	const context = t.context.colour;

	t.is(context.black.m(),   "\x1B[30m");
	t.is(context.red.m(),     "\x1B[31m");
	t.is(context.green.m(),   "\x1B[32m");
	t.is(context.yellow.m(),  "\x1B[33m");
	t.is(context.blue.m(),    "\x1B[34m");
	t.is(context.magenta.m(), "\x1B[35m");
	t.is(context.cyan.m(),    "\x1B[36m");
	t.is(context.white.m(),   "\x1B[37m");
});

test("Colour getter returns a new instance of the class", t => {
	const context = t.context.colour.black;

	t.is(context.constructor.name, "Colour");
	// not the same instance
	t.not(context, t.context.colour);
});

test("Prototype chain returns the expected code", t => {
	const context = t.context.colour.bold;

	t.is(context.black.m(),   "\x1B[1;30m");
	t.is(context.red.m(),     "\x1B[1;31m");
	t.is(context.green.m(),   "\x1B[1;32m");
	t.is(context.yellow.m(),  "\x1B[1;33m");
	t.is(context.blue.m(),    "\x1B[1;34m");
	t.is(context.magenta.m(), "\x1B[1;35m");
	t.is(context.cyan.m(),    "\x1B[1;36m");
	t.is(context.white.m(),   "\x1B[1;37m");
});

test("Prototype chain returns a new instance of the class", t => {
	const colour = t.context.colour.black;

	const context = colour.bold;

	t.is(context.constructor.name, "Colour");
	// not the same instance
	t.not(context, colour);
	t.not(context, t.context.colour);
});

test("fg/bg(r, g, b) sets an RGB colour", t => {
	const context = t.context.colour;
	const colour = [200, 100, 50];

	t.is(context.fg(...colour).m(), "\x1B[38;2;200;100;50m");
	t.is(context.bg(...colour).m(), "\x1B[48;2;200;100;50m");
});

test("fg/bg('#RRGGBB') sets a HEX colour", t => {
	const context = t.context.colour;
	const colour = "#C86432";

	t.is(context.fg(colour).m(), "\x1B[38;2;200;100;50m");
	t.is(context.bg(colour).m(), "\x1B[48;2;200;100;50m");
});

test("fg/bg('#RGB') sets a HEX colour", t => {
	const context = t.context.colour;
	const colour = "#F1F";

	t.is(context.fg(colour).m(), "\x1B[38;2;255;17;255m");
	t.is(context.bg(colour).m(), "\x1B[48;2;255;17;255m");
});

test("fg/bg(h, s, l) sets an HSL colour", t => {
	td.when(t.context.hsl_to_rgb(20, 60, 49)).thenReturn([200, 100, 50]);

	const context = t.context.colour;
	const colour = [20, "60%", "49%"];

	t.is(context.fg(...colour).m(), "\x1B[38;2;200;100;50m");
	t.is(context.bg(...colour).m(), "\x1B[48;2;200;100;50m");
});

test("fg/bg(i) sets an 8bit palette colour", t => {
	const context = t.context.colour;
	const colour = 100;

	t.is(context.fg(colour).m(), "\x1B[38;5;100m");
	t.is(context.bg(colour).m(), "\x1B[48;5;100m");
});

test("Palette fails on bad input", t => {
	fc.check(
		fc.property(
			fc.oneof(
				fc.constant(null),
				fc.constant(-1),
				fc.constant(256),
				fc.boolean()
			),
			index => {
				t.throws(() => t.context.colour.palette(index), TypeError);
			}
		)
	);
});

test("HEX fails on bad input", t => {
	fc.check(
		fc.property(
			fc.oneof(
				fc.constant(null),
				fc.boolean(),
				fc.integer(),
				fc.float(),
				fc.constant("#k3"),
				fc.constant("#k33"),
				fc.constant("#3k3"),
				fc.constant("#33k")
			),
			hexa => {
				t.throws(() => t.context.colour.hex(hexa), TypeError);
			}
		)
	);
});

test("HSL fails on bad input", t => {
	fc.check(
		fc.property(
			fc.oneof(
				fc.constant(null),
				fc.boolean(),
				fc.constant(-1),
				fc.constant(361)
			),
			fc.oneof(
				fc.constant(null),
				fc.boolean(),
				fc.constant(-1),
				fc.constant(101)
			),
			fc.oneof(
				fc.constant(null),
				fc.boolean(),
				fc.constant(-1),
				fc.constant(101)
			),
			(h, s, l) => {
				t.throws(() => t.context.colour.hsl(h, s, l), TypeError);
			}
		)
	);
});

test("RGB fails on bad input", t => {
	fc.check(
		fc.property(
			fc.oneof(
				fc.constant(null),
				fc.boolean(),
				fc.constant(-1),
				fc.constant(256)
			),
			fc.oneof(
				fc.constant(null),
				fc.boolean(),
				fc.constant(-1),
				fc.constant(256)
			),
			fc.oneof(
				fc.constant(null),
				fc.boolean(),
				fc.constant(-1),
				fc.constant(256)
			),
			(r, g, b) => {
				t.throws(() => t.context.colour.rgb(r, g, b), TypeError);
			}
		)
	);
});

test("fg fails on bad input", t => {
	const context = t.context.colour._set_colour;

	t.throws(() => context(true, false), TypeError);
});

test("Empty return if not a TTY", t => {
	td.when(t.context.checktty()).thenReturn(false);
	const colour = require("../lib/tinta");

	t.is(colour._get_colour("42").m(), "");
});
