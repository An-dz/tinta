"use strict";

const Benchmark = require("benchmark");
const chalk = require("chalk");
const kleur = require("kleur");
const colors = require("colors/safe");
const ansi_colors = require("ansi-colors");
const colorette = require("..");
const tinta = require("tinta");

const styles = [
	"reset",
	"bold",
	"dim",
	"italic",
	"underline",
	"inverse",
	"hidden",
	"strikethrough",
	"black",
	"red",
	"green",
	"yellow",
	"blue",
	"magenta",
	"cyan",
	"white",
	"gray",
	"bgBlack",
	"bgRed",
	"bgGreen",
	"bgYellow",
	"bgBlue",
	"bgMagenta",
	"bgCyan",
	"bgWhite"
];

const using = new Benchmark.Suite("Using Styles");

using.
	add("Using chalk", () => {
		styles.map(s => chalk[s]("colour"));
	}).
	add("Using kleur", () => {
		styles.map(s => kleur[s]("colour"));
	}).
	add("Using colors", () => {
		styles.map(s => colors[s]("colour"));
	}).
	add("Using ansi_colors", () => {
		styles.map(s => ansi_colors[s]("colour"));
	}).
	add("Using colorette", () => {
		styles.map(s => colorette[s]("colour"));
	}).
	add("Using tinta template", () => {
		styles.map(s => `${tinta[s]}colour`);
	}).
	add("Using tinta concatenate", () => {
		styles.map(s => tinta[s] + "colour");
	}).
	add("Using tinta", () => {
		styles.map(s => tinta[s].m());
	}).
	on("cycle", (event) => {
		console.log(String(event.target));
	}).
	on("complete", function() {
		console.log(`Fastest is ${this.filter("fastest").map("name")}`);
	}).
	run();

const combined = new Benchmark.Suite("Combined Styles");

combined.
	add("Combined chalk", () => {
		chalk.red.bgWhite.bold.underline.italic("Engage!");
	}).
	add("Combined kleur", () => {
		kleur.red().bgWhite().bold().underline().italic("Engage!");
	}).
	add("Combined colors", () => {
		colors.red.bgWhite.bold.underline.italic("Engage!");
	}).
	add("Combined ansi_colors", () => {
		ansi_colors.red.bgWhite.bold.underline.italic("Engage!");
	}).
	add("Combined colorette", () => {
		colorette.red(colorette.bgWhite(colorette.bold(colorette.underline(colorette.italic("Engage!")))));
	}).
	add("Combined tinta", () => {
		`${tinta.red.bgWhite.bold.underline.italic}Engage!${tinta.reset}`;
	}).
	on("cycle", (event) => {
		console.log(String(event.target));
	}).
	on("complete", function() {
		console.log(`Fastest is ${this.filter("fastest").map("name")}`);
	}).
	run({});

const nested = new Benchmark.Suite("Nested Styles");

nested.
	add("Nested chalk", () => {
		chalk.red(`RED, ${chalk.blue(`BLUE, ${chalk.bold(`BOLD AND ${chalk.yellow("YELLOW")}. BACK TO BLUE, ${chalk.underline("UNDERLINE,")}`)} MORE BLUE, ${chalk.magenta(`MAGENTA, ${chalk.white("WHITE,")}${chalk.cyan(` CYAN, ${chalk.italic(`ITALIC ${chalk.bold("BOLD")} ITALIC`)}, CYAN,`)} MAGENTA,`)} BLUE`)} AND BACK TO RED.`);
	}).
	add("Nested kleur", () => {
		kleur.red(`RED, ${kleur.blue(`BLUE, ${kleur.bold(`BOLD AND ${kleur.yellow("YELLOW")}. BACK TO BLUE, ${kleur.underline("UNDERLINE,")}`)} MORE BLUE, ${kleur.magenta(`MAGENTA, ${kleur.white("WHITE,")}${kleur.cyan(` CYAN, ${kleur.italic(`ITALIC ${kleur.bold("BOLD")} ITALIC`)}, CYAN,`)} MAGENTA,`)} BLUE`)} AND BACK TO RED.`);
	}).
	add("Nested colors", () => {
		colors.red(`RED, ${colors.blue(`BLUE, ${colors.bold(`BOLD AND ${colors.yellow("YELLOW")}. BACK TO BLUE, ${colors.underline("UNDERLINE,")}`)} MORE BLUE, ${colors.magenta(`MAGENTA, ${colors.white("WHITE,")}${colors.cyan(` CYAN, ${colors.italic(`ITALIC ${colors.bold("BOLD")} ITALIC`)}, CYAN,`)} MAGENTA,`)} BLUE`)} AND BACK TO RED.`);
	}).
	add("Nested ansi_colors", () => {
		ansi_colors.red(`RED, ${ansi_colors.blue(`BLUE, ${ansi_colors.bold(`BOLD AND ${ansi_colors.yellow("YELLOW")}. BACK TO BLUE, ${ansi_colors.underline("UNDERLINE,")}`)} MORE BLUE, ${ansi_colors.magenta(`MAGENTA, ${ansi_colors.white("WHITE,")}${ansi_colors.cyan(` CYAN, ${ansi_colors.italic(`ITALIC ${ansi_colors.bold("BOLD")} ITALIC`)}, CYAN,`)} MAGENTA,`)} BLUE`)} AND BACK TO RED.`);
	}).
	add("Nested colorette", () => {
		colorette.red(`RED, ${colorette.blue(`BLUE, ${colorette.bold(`BOLD AND ${colorette.yellow("YELLOW")}. BACK TO BLUE, ${colorette.underline("UNDERLINE,")}`)} MORE BLUE, ${colorette.magenta(`MAGENTA, ${colorette.white("WHITE,")}${colorette.cyan(` CYAN, ${colorette.italic(`ITALIC ${colorette.bold("BOLD")} ITALIC`)}, CYAN,`)} MAGENTA,`)} BLUE`)} AND BACK TO RED.`);
	}).
	add("Nested tinta", () => {
		`${tinta.red}RED, ${tinta.blue}BLUE, ${tinta.bold}BOLD AND ${tinta.yellow}YELLOW${tinta.blue}. BACK TO BLUE, ${tinta._}UNDERLINE,${tinta.reset.blue} MORE BLUE, ${tinta.magenta}MAGENTA, ${tinta.white}WHITE,${tinta.cyan} CYAN, ${tinta.intalic}ITALIC ${tinta.bold}BOLD${tinta.normal} ITALIC${tinta.italic_off}, CYAN,${tinta.magenta} MAGENTA,${tinta.blue} BLUE${tinta.red} AND BACK TO RED.`;
	}).
	on("cycle", (event) => {
		console.log(String(event.target));
	}).
	on("complete", function() {
		console.log(`Fastest is ${this.filter("fastest").map("name")}`);
	}).
	run({});
