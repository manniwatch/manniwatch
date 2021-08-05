# ManniWatch
{{ template:badges }}
## Packages

{{ toc_data }}

## Build & Test
Before you either do both run:

    npm install
    npx lerna bootstrap --no-ci
    npm run build

This project does use [lerna](https://github.com/lerna/lerna) so all common [commands](https://github.com/lerna/lerna/tree/master/commands) should work from the root directory!
Due to packages depending on each other a build is **required** first before running tests!

### Build & Test all packages

    npm run build
    npm run test

### Build & Test a specific package
    npx lerna run build --scope=@manniwatch/api-types
    npx lerna run test --scope=@manniwatch/api-types

## Docker

See [this repository](https://github.com/manniwatch/docker) for a Docker Container
