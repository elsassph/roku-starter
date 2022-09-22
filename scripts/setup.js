"use strict";
const fs = require("fs");
const root = process.cwd();

// scaffold useful user-specific files

maybeCopy("env.sample.properties", ".env");

if (!fs.existsSync(`${root}/.vscode`)) {
  fs.mkdirSync(`${root}/.vscode`);
}

maybeCopy("launch.sample.json", ".vscode/launch.json");
maybeCopy("settings.sample.json", ".vscode/settings.json");
maybeCopy("extensions.sample.json", ".vscode/extensions.json");

function maybeCopy(source, dest) {
  if (!fs.existsSync(`${root}/${dest}`)) {
    fs.copyFileSync(`${root}/scripts/sample/${source}`, `${root}/${dest}`);
  }
}
