import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import path from 'path';

const plugins = [
  typescript(),
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
