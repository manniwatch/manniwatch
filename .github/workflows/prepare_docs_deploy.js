const fs = require('fs');
const path = require('path');
const fsextra = require('fs-extra')

const outputDir = path.join('.', path.sep, 'docs');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}
const basePackageDir = path.join('.', path.sep, 'packages');
const dirs = fs.readdirSync(basePackageDir);
let README = "# @manniwatch Docs\nDocs for manniwatch packages\n\n";
for (let dir of dirs) {
    const packageDir = path.join(basePackageDir, path.sep, dir);
    if (!fs.lstatSync(packageDir).isDirectory()) {
        continue;
    }
    const packageDocsDir = path.join(packageDir, path.sep, 'docs');
    if (!fs.existsSync(packageDocsDir) || !fs.lstatSync(packageDocsDir).isDirectory()) {
        continue;
    }
    console.log("Create docs symlink", packageDocsDir);
    fsextra.copySync(packageDocsDir, path.join(outputDir, path.sep, dir));
    README += `## [${dir}](http://manniwatch.github.io/docs/${dir}/)\n`;
    README += `Docs for [${dir}](http://github.com/manniwatch/manniwatch/tree/master/packages/${dir}/)\n\n`;
}

fs.writeFileSync(path.join(outputDir, 'README.md'), README, { encoding: 'utf8' });
