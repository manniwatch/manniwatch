const config = require("./../../typedoc.json");
config.entryPoints = [
    './src/preload/manniwatch-api.ts',
    './src/main/app-callback.ts',
    './src/main/cli/index.ts',
];
config.tsconfig = "./tsconfig.json";
config.logLevel = "Verbose";
config.entryPointStrategy = "resolve";
module.exports = config;
