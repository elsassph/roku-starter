"use strict";
const path = require("path");
const yargs = require("yargs");
const {
  deleteInstalledChannel,
  publish,
  signExistingPackage,
  retrieveSignedPackage,
} = require("roku-deploy");
require("dotenv").config();

const { _: targets, sign } = yargs.argv;

// target is either provided as is, or found based on env/pub parmeters
const zipFile = targets[0];
if (!zipFile) {
  console.log("Missing target ZIP file to deploy");
  process.exit(1);
}

if (sign && !process.env.ROKU_SIGNATURE) {
  throw "Signing password missing (env.ROKU_SIGNATURE)";
}

const options = {
  outDir: path.dirname(zipFile),
  outFile: path.basename(zipFile),
  host: process.env.ROKU_HOST,
  password: process.env.ROKU_PWD,
  signingPassword: process.env.ROKU_SIGNATURE,
};

async function deploy() {
  console.log("Uninstalling...");
  try {
    await deleteInstalledChannel(options);
  } catch (err) {
    // ignore
  }

  console.log(`Installing ${zipFile}...`);
  const publishResult = await publish(options);
  console.log("Done:", publishResult.message);

  // TODO rekey

  if (!!sign) {
    console.log(`Signing ${zipFile}...`);
    options.stagingFolderPath = "./src"; // to resolve the manifest
    const signedPackage = await signExistingPackage(options);
    if (signedPackage) {
      const retrievedPackage = await retrieveSignedPackage(
        signedPackage,
        options
      );
      console.log("Done:", retrievedPackage);
    } else {
      console.log("FAILED.");
    }
  }
}

deploy();
