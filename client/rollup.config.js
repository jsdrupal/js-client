// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'index.ts',
  output: {
    exports: 'named',
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [typescript()],
};
