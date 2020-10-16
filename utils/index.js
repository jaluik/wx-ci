const path = require('path');
const fs = require('fs');
const ora = require('ora');

exports.checkConfigFile = () => {
  const configPath = path.resolve(`${process.cwd}`, 'wxci.config.js');
  return fs.existsSync(configPath);
};

exports.info = (text) => {
  console.log(text);
};

exports.success = (text) => {
  ora().succeed(text);
};

exports.warn = (text) => {
  ora().warn(text);
};

exports.fail = (text) => {
  ora().fail(text);
};
