#!/usr/bin/env node
const child_process = require("child_process");
const fs = require("fs");
const txt = fs.readFileSync("package.json", "utf8");
const parseTxt = JSON.parse(txt);
let min = Number(parseTxt.version.split(".")[1]);
let patch = Number(parseTxt.version.split(".")[2]);
patch++;
let command = "npm version patch";
if (patch == 100) {
  min += 1;
  command = "npm version minor";
}

if (min == 100) {
  command = "npm version major";
}
child_process.execSync(command).toString();
process.exit(0);
