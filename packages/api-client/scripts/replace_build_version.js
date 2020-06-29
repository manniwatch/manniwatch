const glob = require('glob');
const jsFiles = glob.sync('./dist/**/*.js');
const fs = require('fs');
const searchKey = '___PACKAGE_VERSION___';
const { version } = require('../package.json');
for (let file of jsFiles) {
    let content = fs.readFileSync(file, { encoding: 'utf-8' });
    if (content.indexOf(searchKey) >= 0) {
        content = content.split(searchKey).join(version);
        fs.writeFileSync(file, content, { encoding: 'utf-8' });
    }
}
