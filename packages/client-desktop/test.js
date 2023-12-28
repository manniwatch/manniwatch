const  {createRequire}=require('node:module')
const b = createRequire(__dirname)
//const c = b.resolve('@manniwatch/client-ng',{paths:module.paths})
console.log(b,require.resolve('@manniwatch/client-ng/package.json'));