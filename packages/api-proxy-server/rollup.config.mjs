import defaultRollup from '@donmahallem/rollup-config';
import pkg from './package.json' with { type: "json" };

export default defaultRollup(pkg);
