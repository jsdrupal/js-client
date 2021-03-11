// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    exports: 'named',
    dir: 'dist',
  },
  plugins: [typescript()],
};
