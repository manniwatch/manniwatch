const glob = require('glob');
const fs = require('fs');
const path = require('path');
const libCoverage = require('istanbul-lib-coverage');
const libReport = require('istanbul-lib-report');
const reports = require('istanbul-reports');
const coverages = glob.sync('./packages/*/coverage/**/*.json');
const rootFolder = './'
const mergeIntoFolder = './coverage'
let mergedCoverageMap = null;
for (const coverageFile of coverages) {
    const fullPath = path.resolve(rootFolder, coverageFile);
    console.log("Merge Coverage:", fullPath)
    if (coverageFile !== mergeIntoFolder) {

        const map = libCoverage.createCoverageMap(JSON.parse(fs.readFileSync(fullPath, 'utf8')));
        if (mergedCoverageMap !== null) {
            mergedCoverageMap.merge(map);
        }
        else {
            mergedCoverageMap = map;
        }
    }
}
const context = libReport.createContext({
    coverageMap: mergedCoverageMap,
    defaultSummarizer: 'nested',
    dir: path.join(rootFolder, mergeIntoFolder),

});
const htmlReport = reports.create('html', {
    //skipEmpty: configSkipEmpty,
    //skipFull: configSkipFull
});
const jsonReport = reports.create('json', {
    file: 'coverage-final.json'
})
const lcovReport = reports.create('lcovonly', {
    file: 'lcov.info'
})

// call execute to synchronously create and write the report to disk
jsonReport.execute(context);
htmlReport.execute(context);
lcovReport.execute(context);
