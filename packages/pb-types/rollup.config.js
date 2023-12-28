import myExample from './rollup-pb.js';
import nodeResolve from '@rollup/plugin-node-resolve';
export default ({
  input: 'virtual-module', // resolved by our plugin
  plugins: [myExample(),nodeResolve( {
        preferBuiltins: true,
    }
)],
  output: [{
    file: 'bundle.mjs',
    format: 'es'
  },{
    file: 'bundle.cjs',
    format: 'cjs'
  }]
});