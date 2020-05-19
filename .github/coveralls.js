const glob = require('glob');
const coveralls = require('coveralls');
const fs = require('fs');
const path = require('path');
const request = require('request');
function kebabToPascal(inp) {
    return inp.split('-').map((item) => {
        return item.substr(0, 1).toUpperCase() + item.substr(1);
    }).join('');
}

function getOptionsProm(opts) {
    return new Promise((resolve, reject) => {
        coveralls.getOptions((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        }, opts);
    })
}

function convertLcovToCoverallsProm(inp, opts) {
    return new Promise((resolve, reject) => {
        coveralls.convertLcovToCoveralls(inp, opts, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    })
};

function sendToCoverallsProm(data) {
    return new Promise((resolve, reject) => {
        coveralls.sendToCoveralls(data, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    })
};

function finishUpload(runId) {

    return new Promise((resolve, reject) => {
        const payload = {
            "repo_token": process.env.COVERALLS_REPO_TOKEN,
            "repo_name": process.env.GITHUB_REPOSITORY,
            "payload": { "build_num": runId, "status": "done" }
        };

        request.post({
            url: `${process.env.COVERALLS_ENDPOINT || 'https://coveralls.io'}/webhook`,
            body: payload,
            json: true
        }, (error, _response, data) => {
            if (error) {
                reject(error)
                return;
            }
            resolve(data);
        })
    });
}

const adjustLcovBasePath = (lcovFile, basePath) =>
    lcovFile.replace(/^SF:(.+)$/gm, (_, match) => `SF:${path.join(basePath, match)}`);
(async () => {


    // process.env.COVERALLS_REPO_TOKEN = githubToken;

    process.env.COVERALLS_SERVICE_NAME = 'github';
    process.env.COVERALLS_GIT_COMMIT = process.env.GITHUB_SHA || '';// !.toString();
    process.env.COVERALLS_GIT_BRANCH = process.env.GITHUB_REF || '';// !.toString();

    const event = fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8');
    if (process.env.GITHUB_EVENT_NAME == 'pull_request') {
        process.env.CI_PULL_REQUEST = JSON.parse(event).number;
    }
    const runId = process.env.GITHUB_RUN_ID;
    process.env.COVERALLS_SERVICE_JOB_ID = runId;
    process.env.COVERALLS_PARALLEL = true;

    const projects = glob.sync('./packages/*/coverage/**/lcov.info');
    for (let project of projects) {
        const pathSplit = project.split('\/');
        const tagName = pathSplit[2];
        const projectName = kebabToPascal(tagName);
        console.group(projectName)
        const opts = await getOptionsProm({
            flag_name: tagName,
            parallel: true,
        });
        const lcovData = fs.readFileSync(project, { encoding: 'utf8' });
        const modifiedLcovData = adjustLcovBasePath(lcovData, path.join('.', 'packages', tagName))
        const converted = await convertLcovToCoverallsProm(modifiedLcovData, opts);
        const response = await sendToCoverallsProm(converted);
        console.log("Response:", response.status, response.statusCode);
        console.log("LCOV Path:", project);
        console.log("Tag Name:", tagName)
        console.groupEnd();
    }
    const reslt = await finishUpload(runId);
    console.log("Done", reslt);
})().catch((err) => {
    console.error(err);
    process.exit(2);
});
