'use strict';

require("bytenode");
const path = require("path");
const fs = require("fs");
const archJsc = path.join(__dirname, "main." + process.arch + ".jsc");
const fallbackJsc = path.join(__dirname, "main.jsc");
const jscPath = fs.existsSync(archJsc) ? archJsc : fallbackJsc;
if (!fs.existsSync(jscPath)) {
  console.error("[Loader] main bytecode missing for arch=" + process.arch);
  process.exit(1);
}
require(jscPath);