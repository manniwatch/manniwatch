const lernaProject = require('@lerna/project');

const packages = lernaProject.Project.getPackagesSync('./');

const tempFileName = './temp_readme_config.json';
function createTempFile() {
    function createVersionLabel(packageName) {
        const encodedName = encodeURIComponent(packageName);
        return `<a href="https://badge.fury.io/js/${encodedName}"><img alt="npm version" `
            + `src="https://badge.fury.io/js/${encodedName}.svg" height="20"/></a>`;
    }
    const path = require('path');
    const dataArray = [['Name', 'Description', 'Version']]
        .concat(packages
            .map((package) => {
                const relativePath = package.get('homepage') ?
                    package.get('homepage') :
                    `https://github.com/manniwatch/manniwatch/tree/master/${path.relative(package.rootPath, package.location)}`;
                const name = package.get('name');
                const description = package.get('description');
                const version = package.get('version');
                return [
                    `[${name}](${relativePath})`,
                    description ? description : ' - ',
                    version ? createVersionLabel(name) : ' - ',
                ];
            }));

    const fs = require('fs');

    fs.writeFileSync(tempFileName, JSON.stringify({ toc_data: dataArray }));
    console.log(`Created config for ${dataArray.length} Packages`)
}

function deleteTempFile() {
    const fs = require('fs');

    fs.unlinkSync(tempFileName);
    console.log(`Deleted temp file`);
}
if (process.argv[2] === 'clear') {
    deleteTempFile();
} else {
    createTempFile();
}
