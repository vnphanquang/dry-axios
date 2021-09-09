import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import path from 'path';
import nodeResolver from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';

const plugins = [
  typescript(),
  nodeResolver(),
  commonjs(),
  filesize(),
];
const input = path.resolve(__dirname, './src/index.ts');

const external = [
  'axios',
];

export default [
  {
    input,
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    external,
    plugins,
  },
  {
    input,
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    external,
    plugins,
  },
];
