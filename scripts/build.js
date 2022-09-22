"use strict";
const fs = require("fs");
const path = require("path");
const properties = require("properties-file");
const { createPackage, deployAndSignPackage } = require("roku-deploy");
const yargs = require("yargs");
require("dotenv").config();

// options
const argv = yargs
  .usage("$0", "Prepare the files")
  .option("env", {
    description: "Target environment (test, production)",
    type: "string",
    default: "test",
  })
  .option("sign", {
    description: "Sign package (box required)",
    type: "string",
  }).argv;
const { env, sign } = argv;

const buildTimestamp = new Date().getTime().toString().substring(0, 9);
const { appName, appVersion } = getAppInfo();
const stagingFolderPath = `out/.${appName}-roku-${env}`;
const output = `out/${appName}-roku-${env}-${appVersion}.zip`;

// update base configuration
const options = {
  ...JSON.parse(fs.readFileSync("bsconfig.json").toString()),
  sourceMap: false,
  stagingFolderPath,
  retainStagingFolder: false,
  outDir: path.dirname(output),
  outFile: path.basename(output),
};

// omit files
options.files.push("!**/*.test.brs");

if (!!sign) {
  console.log(`Packaging and signing app for ${env} environment...`);
  options.host = process.env.ROKU_HOST;
  options.password = process.env.ROKU_PWD;
  options.signingPassword = sign;
  deployAndSignPackage(options, preprocess).then((pkg) =>
    console.log(`Done: ${pkg}`)
  );
} else {
  console.log(`Packaging app for ${env} environment...`);
  createPackage(options, preprocess).then(() => console.log(`Done: ${output}`));
}

function preprocess() {
  updateManifest();
}

function getMajorVersion(props) {
  return props.major_version; // or override with CI variables
}
function getMinorVersion(props) {
  return props.minor_version; // or override with CI variables
}
function getBuildVersion() {
  return buildTimestamp; // or override with CI variables
}

function updateManifest() {
  const manifest = path.join(stagingFolderPath, "manifest");
  const props = properties.parse(fs.readFileSync(manifest).toString());

  // update app title
  if (env !== "production") props.title += ` (${env})`;

  // update version
  props.major_version = getMajorVersion(props);
  props.minor_version = getMinorVersion(props);
  props.build_version = getBuildVersion();

  fs.writeFileSync(manifest, properties.stringify(props) + "\n");
}

function getAppInfo() {
  const props = properties.parse(fs.readFileSync("src/manifest").toString());
  const appName = props.title.replace(" ", "-");
  const appVersion = `${getMajorVersion(props)}.${getMinorVersion(
    props
  )}.${getBuildVersion()}`;
  return {
    appName,
    appVersion,
  };
}
