'use strict';
const fs = require('fs');
const { deploy } = require('roku-deploy');
require('dotenv').config();

console.log('Packaging and installing...');

deploy({
    ...JSON.parse(fs.readFileSync('bsconfig.json').toString()),
    host: process.env.ROKU_HOST,
    password: process.env.ROKU_PWD
}).then(result => {
    console.log('Done:', result.message);
});
