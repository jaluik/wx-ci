import path from 'path';
import fs from 'fs';
import ora from 'ora';

export const checkConfigFile = (filePath: string) => {
  const configPath = path.resolve(`${process.cwd()}`, filePath);
  return fs.existsSync(configPath);
};

export const info = (text: string) => {
  console.log(text);
};

export const success = (text: string) => {
  ora().succeed(text);
};

export const warn = (text: string) => {
  ora().warn(text);
};

export const fail = (text: string) => {
  ora().fail(text);
};
