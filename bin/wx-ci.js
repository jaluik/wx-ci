#!/usr/bin/env node

const WxCi = require('../src/wxCi');
const argv = require('minimist')(process.argv.slice(2));

const wxCi = new WxCi();

const command = argv._[0];
wxCi.run(command);
