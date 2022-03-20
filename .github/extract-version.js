const data = require('./../lerna.json');
console.log(`::set-output name=version::${data.version}`)