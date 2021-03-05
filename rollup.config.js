import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import path from 'path';
import nodeResolver from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const plugins = [
  typescript(),
  nodeResolver(),
  commonjs(),
];
const input = path.resolve(__dirname, './src/index.ts');

export default [
  {
    input,
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    plugins,
  },
  {
    input,
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    plugins,
  },
];
