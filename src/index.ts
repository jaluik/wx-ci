#!/usr/bin/env node

import WxCi from './wxCi';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

const wxCi = new WxCi();

const command = argv._[0];
wxCi.run(command);
