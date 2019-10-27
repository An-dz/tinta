"use strict";

/**
 * @var {object} colours List all getter names and their
 * respective ANSI escape codes
 */
const colours = {};

/*************************************************
 *                   Intensity                   *
 *************************************************/
colours.reset              = "0";

colours.bold               = "1";
colours.bright             = colours.bold;

colours.faint              = "2";
colours.dim                = colours.faint;

colours.normal             = "22";
colours.normal_color       = colours.normal;
colours.color_normal       = colours.normal;
colours.normal_intensity   = colours.normal;
colours.intensity_normal   = colours.normal;
colours.bold_off           = colours.normal;
colours.bright_off         = colours.normal;
colours.faint_off          = colours.normal;
colours.dim_off            = colours.normal;

/*************************************************
 *                    Italics                    *
 *************************************************/
colours.italic             = "3";
colours.italic_off         = "23";

/*************************************************
 *                   Blinking                    *
 *************************************************/
colours.slow_blink         = "5";
colours.blink_slow         = colours.slow_blink;
colours.blink              = colours.slow_blink;

colours.rapid_blink        = "6";
colours.blink_rapid        = colours.rapid_blink;
colours.fast_blink         = colours.rapid_blink;
colours.blink_fast         = colours.rapid_blink;

colours.blink_off          = "25";

/*************************************************
 *                    Reverse                    *
 *************************************************/
colours.reverse            = "7";
colours.inverse            = colours.reverse;
colours.invert             = colours.reverse;
colours.swap               = colours.reverse;

colours.reverse_off        = "27";
colours.inverse_off        = colours.reverse_off;
colours.invert_off         = colours.reverse_off;
colours.swap_off           = colours.reverse_off;

/*************************************************
 *                   Concealed                   *
 *************************************************/
colours.conceal            = "8";
colours.hide               = colours.conceal;
colours.hidden             = colours.conceal;

colours.conceal_off        = "28";
colours.reveal             = colours.conceal_off;
colours.hide_off           = colours.conceal_off;
colours.hidden_off         = colours.conceal_off;

/*************************************************
 *                  Crossed-out                  *
 *************************************************/
colours.crossed            = "9";
colours.crossed_out        = colours.crossed;
colours.strike             = colours.crossed;
colours.strikethrough      = colours.crossed;
colours.strike_through     = colours.crossed;

colours.crossed_off        = "29";
colours.crossed_out_off    = colours.crossed_off;
colours.strike_off         = colours.crossed_off;
colours.strikethrough_off  = colours.crossed_off;
colours.strike_through_off = colours.crossed_off;

/*************************************************
 *                   Specials                    *
 *************************************************/
colours.frame              = "51";
colours.encircle           = "52";
colours.overline           = "53";
colours.frame_off          = "54";
colours.encircle_off       = colours.frame_off;
colours.overline_off       = "55";

/*************************************************
 *                     Fonts                     *
 *************************************************/
const fonts = {
	font10: "10",
	font11: "11",
	font12: "12",
	font13: "13",
	font14: "14",
	font15: "15",
	font16: "16",
	font17: "17",
	font18: "18",
	font19: "19",
	font20: "20",
};

// generate fonts0 - fonts9
Object.values(fonts).forEach(colour => {
	if (colour === "20") {
		return;
	}

	const code = `${Number(colour) - 10}`;

	fonts[`font${code}`] = colour;
});

// append extra names for some font options
fonts.font_primary = fonts.font10;
fonts.primary_font = fonts.font10;
fonts.font_normal  = fonts.font10;
fonts.normal_font  = fonts.font10;
fonts.fraktur      = fonts.font20;
fonts.gothic       = fonts.font20;
fonts.fraktur_off  = colours.italic_off;
fonts.gothic_off   = colours.italic_off;

Object.assign(colours, fonts);

/*************************************************
 *           Foreground and background           *
 *************************************************/
const foreground = {
	black:   "30",
	red:     "31",
	green:   "32",
	yellow:  "33",
	blue:    "34",
	magenta: "35",
	cyan:    "36",
	white:   "37",
};

// generate bright from normal colours
Object.entries(foreground).forEach(colour => {
	const code = `${Number(colour[1]) + 60}`;

	foreground[`${colour[0]}_bright`] = code;
	foreground[`bright_${colour[0]}`] = code;
});

foreground.gray = foreground.bright_black;
foreground.grey = foreground.bright_black;

// generate background from foreground
const background = {};

Object.entries(foreground).forEach(colour => {
	const code = `${Number(colour[1]) + 10}`;

	background[`${colour[0]}_bg`] = code;
	background[`bg_${colour[0]}`] = code;
});

// add options with fg at both sides of the strings
Object.entries(foreground).forEach(colour => {
	foreground[`${colour[0]}_fg`] = colour[1];
	foreground[`fg_${colour[0]}`] = colour[1];
});

Object.assign(colours, foreground, background);

// codes for default colours
colours.default_fg       = "39";
colours.fg_default       = colours.default_fg;

colours.default_bg       = "49";
colours.bg_default       = colours.default_bg;

/*************************************************
 *                   Underline                   *
 *************************************************/
colours.underline        = "4";
colours.double_underline = "21";
colours.underline_off    = "24";

colours.underline_double = colours.double_underline;
colours.underline2       = colours.double_underline;

const underlines = {
	_:     colours.underline,
	__:    colours.double_underline,
	_off:  colours.underline_off,
	__off: colours.underline_off,
};

/*************************************************
 *              Generate camelCase               *
 *************************************************/
/**
 * @brief Generate camelCase getters
 *
 * All getters and their aliases are defined with snake_case,
 * this function automatically creates camelCase options of them.
 *
 * @param {object} obj The object that contains the getters
 */
function generateCamelCase(obj) {
	Object.entries(obj).forEach(entry => {
		const colour = entry[0];
		const code = entry[1];
		if (colour.indexOf("_") > -1) {
			const key = colour.replace(/_(.)/g, (_u, c1) => c1.toUpperCase());
			obj[key] = code;
		}
	});
}

generateCamelCase(colours);

Object.assign(colours, underlines);

module.exports = colours;
