"use strict";

import test from "ava";
import { testProp, fc } from "ava-fast-check";
import hsl_to_rgb from "../lib/hsl_to_rgb";

testProp("HSL converter never fails",
	[fc.integer(0, 360), fc.integer(0, 100), fc.integer(0, 100)],
	(h, s, l) => {
		const context = hsl_to_rgb(h, s, l);

		return context[0] > -1 && context[0] < 256 &&
		       context[1] > -1 && context[1] < 256 &&
		       context[2] > -1 && context[2] < 256;
	}
);

testProp("HSL with 100% lightness is always white",
	[fc.integer(0, 360), fc.integer(0, 100)],
	(h, s) => {
		const context = hsl_to_rgb(h, s, 100);

		return context[0] === "255" && context[1] === "255" && context[2] === "255";
	}
);

testProp("HSL with 0% lightness is always black",
	[fc.integer(0, 360), fc.integer(0, 100)],
	(h, s) => {
		const context = hsl_to_rgb(h, s, 0);

		return context[0] === "0" && context[1] === "0" && context[2] === "0";
	}
);

testProp("HSL with 0% saturation is always equal",
	[fc.integer(0, 360)],
	(h) => {
		const context = hsl_to_rgb(h, 0, 50);

		return context[0] === "128" && context[1] === "128" && context[2] === "128";
	}
);

test("HSL converts to correct colour", t => {
	t.deepEqual(hsl_to_rgb(66, 70, 54), ["203", "220", "56"]);
	t.deepEqual(hsl_to_rgb(340, 82, 52), ["233", "32", "99"]);
	t.deepEqual(hsl_to_rgb(199, 98, 48), ["2", "166", "242"]);
});
