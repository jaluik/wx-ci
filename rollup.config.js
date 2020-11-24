import { preserveShebangs } from 'rollup-plugin-preserve-shebangs';
import typescript from 'rollup-plugin-typescript';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';

const key = Object.keys(require('./package.json').dependencies);

export default {
  input: 'src/index.ts',
  output: {
    file: 'bin/wx-ci.js',
    format: 'cjs',
  },
  plugins: [
    preserveShebangs(),
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    json(),
    typescript({
      exclude: 'node_modules/**',
      typescript: require('typescript'),
    }),
    copy({
      targets: [
        {
          src: 'src/wxci.config.js',
          dest: 'lib/',
        },
      ],
    }),
  ],
  external: [...key, /package\.json/],
};
