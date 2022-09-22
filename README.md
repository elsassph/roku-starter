# Roku Starter Project

A simple starter project for Roku, with:

- Useful VSCode defaults
- [roku-deploy](https://github.com/rokucommunity/roku-deploy) for packaging/deploying
- [brighterscript-formatter](https://github.com/rokucommunity/brighterscript-formatter) for formatting
- [brighterscript](https://github.com/rokucommunity/brighterscript) and [@rokucommunity/bslint](https://github.com/rokucommunity/bslint) for code validation

## Installation

Using Node 12+

```
npm install
```

This will set a few useful files:

- `.env`: to edit to configure your Roku device and password
- `.vscode/*`: launch script, settings

## Configuration

- `bsconfig.json`: choose which files go into your Roku package
- `bsfmt.json`: [formatter options](https://github.com/rokucommunity/brighterscript-formatter#bsfmtjson-options)
- [linting options](https://github.com/rokucommunity/bslint#plugin-configuration)

## Developpement

Format your `.brs` code

```
npm run format # dry run
npm run format:write
```

Run on device

```
npm run dev
```

(or just Run > Start debugging in VSCode)

## Linting

```
npm run lint
```

Change `bslint` default [rules](https://github.com/rokucommunity/bslint#plugin-configuration) in `bslint.json`.

Still, sometimes you need to ignore false positives, or exclude 3rd party code from linting:

- [diagnosticFilters](https://github.com/rokucommunity/brighterscript#bsconfigjson-options) in `bsconfig.json` to filter errors (after they are collected),
- [ignores](https://github.com/rokucommunity/bslint#plugin-configuration) in `bslint.json` to skip files from advanced linting

You can also add inline comments `' bs:disable-...` to [ignore errors and warnings on a per-line basis](https://github.com/rokucommunity/brighterscript#ignore-errors-and-warnings-on-a-per-line-basis).

## Building

Prepare package:

```
npm run build
npm run build:prod
```

Install/sign on device:

```
npm run deploy "out/Roku-Starter-roku-production-0.0.123.zip"
npm run sign "out/Roku-Starter-roku-production-0.0.123.zip"
```

TODO: add option to rekey the device before signing

## Going futher: brighterscript

Maybe you want to go to the next step and embrace a richer language?

Check https://github.com/rokucommunity/brighterscript#overview

TODO: instructions to upgrade
