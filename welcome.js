#!/usr/bin/env node
"use strict";

const c = require("./lib/tinta");

console.log(`
                                     ${c.bold.red}o
                                    o8
                                  .o8
     ${c.yellow}.o88${c.grey}8888o...              ${c.red}.o88                  ${c.magenta}o
   ${c.yellow}8°  ${c.grey}oo.      ${c.blue}.8°°°88oo${c.red}oooo°°                    ${c.magenta}o.
  ${c.yellow}8      ${c.grey}O     ${c.blue}.8                                ${c.magenta}.8o
   ${c.yellow}8${c.grey}o..o°      ${c.blue}88       ${c.red}Oo                      ${c.magenta}8o8
              ${c.blue}.8               ${c.green}..   ..   ${c.magenta}......88oooOO${c.yellow}°°°°°°°°°°°°${c.grey}°°°°Oooo...
              ${c.blue}88     ${c.red}.o     ${c.green}.O .8.8° 8.      ${c.magenta}o8°      ${c.yellow}.o8°8  o
             ${c.blue}88    ${c.red}.8°    .${c.green}° .88°  .8°      ${c.magenta}88      ${c.yellow}.8°   o88
            ${c.blue}88   ${c.red}o°8    o  ${c.green}o8°°   .8      ${c.magenta}o°8      ${c.yellow}8°   .88°   ${c.grey}.
           ${c.blue}88     ${c.red} °o.o°  ${c.green}8°°     °8${c.magenta}..oo°  8   .${c.yellow}.o°°88°°  °${c.grey}ooo°
     ${c.blue}...o8°                                 ${c.magenta}°°°${c.yellow}°
`);

console.log(`${" ".repeat(20)}${c.reset.italic.red}by ${c.green}André Zanghelini ${c.blue}(An_dz)`);
console.log(`${" ".repeat(18)}${c.cyan}https://github.com/An-dz/tinta${c.reset}\n`);
