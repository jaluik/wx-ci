import { preserveShebangs } from 'rollup-plugin-preserve-shebangs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'bin/wx-ci.js',
  output: {
    file: 'dist/wxCi.js',
    format: 'cjs',
  },
  plugins: [preserveShebangs(), resolve(), commonjs()],
};
