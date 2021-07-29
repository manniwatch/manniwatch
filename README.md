<!-- ⚠️ This README has been generated from the file(s) "readme_blueprint.md" ⚠️-->
[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/water.png)](#manniwatch)

# ➤ ManniWatch
<p align="center">
		<a href="https://github.com/manniwatch/manniwatch/actions?query=workflow%3ATest+branch%3Amaster"><img alt="Test" src="https://github.com/manniwatch/manniwatch/workflows/Test/badge.svg?branch=master&event=push" height="20"/></a>
<a href="https://codecov.io/gh/manniwatch/manniwatch/branch/master"><img alt="codecov" src="https://codecov.io/gh/manniwatch/manniwatch/branch/master/graph/badge.svg" height="20"/></a>
<a href="https://github.com/manniwatch/manniwatch/releases"><img alt="GitHub release (latest SemVer)" src="https://img.shields.io/github/v/release/manniwatch/manniwatch?sort=semver" height="20"/></a>
<a href="https://github.com/manniwatch/manniwatch/blob/master/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/manniwatch/manniwatch" height="20"/></a>
<a href="https://github.com/manniwatch/manniwatch"><img alt="David" src="https://img.shields.io/david/dev/manniwatch/manniwatch" height="20"/></a>
<a href="https://github.com/manniwatch/manniwatch/graphs/contributors"><img alt="GitHub contributors" src="https://img.shields.io/github/contributors-anon/manniwatch/manniwatch" height="20"/></a>
	</p>


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/water.png)](#packages)

## ➤ Packages
| Package | NPM | Coverage |
| --- | --- | --- |
| [vehicle-location-diff](https://github.com/manniwatch/manniwatch/tree/master/packages/vehicle-location-diff) | [![npm version](https://badge.fury.io/js/%40manniwatch%2Fvehicle-location-diff.svg)](https://badge.fury.io/js/%40manniwatch%2Fvehicle-location-diff) | [![codecov](https://codecov.io/gh/manniwatch/manniwatch/branch/master/graph/badge.svg?flag=VehicleLocationDiff)](https://codecov.io/gh/manniwatch/manniwatch/tree/master/packages/vehicle-location-diff) |
| [api-client](https://github.com/manniwatch/manniwatch/tree/master/packages/api-client) | [![npm version](https://badge.fury.io/js/%40manniwatch%2Fapi-client.svg)](https://badge.fury.io/js/%40manniwatch%2Fapi-client) | [![codecov](https://codecov.io/gh/manniwatch/manniwatch/branch/master/graph/badge.svg?flag=ApiClient)](https://codecov.io/gh/manniwatch/manniwatch/tree/master/packages/api-client) |
| [api-types](https://github.com/manniwatch/manniwatch/tree/master/packages/api-types) | [![npm version](https://badge.fury.io/js/%40manniwatch%2Fapi-types.svg)](https://badge.fury.io/js/%40manniwatch%2Fapi-types) | [![codecov](https://codecov.io/gh/manniwatch/manniwatch/branch/master/graph/badge.svg?flag=ApiTypes)](https://codecov.io/gh/manniwatch/manniwatch/tree/master/packages/api-types) |
| [api-proxy-server](https://github.com/manniwatch/manniwatch/tree/master/packages/api-proxy-server) | [![npm version](https://badge.fury.io/js/%40manniwatch%2Fapi-proxy-server.svg)](https://badge.fury.io/js/%40manniwatch%2Fapi-proxy-server) | [![codecov](https://codecov.io/gh/manniwatch/manniwatch/branch/master/graph/badge.svg?flag=ApiProxyServer)](https://codecov.io/gh/manniwatch/manniwatch/tree/master/packages/api-proxy-server) |
| [api-proxy-router](https://github.com/manniwatch/manniwatch/tree/master/packages/api-proxy-router) | [![npm version](https://badge.fury.io/js/%40manniwatch%2Fapi-proxy-router.svg)](https://badge.fury.io/js/%40manniwatch%2Fapi-proxy-router) | [![codecov](https://codecov.io/gh/manniwatch/manniwatch/branch/master/graph/badge.svg?flag=ApiProxyRouter)](https://codecov.io/gh/manniwatch/manniwatch/tree/master/packages/api-proxy-router) |
| [client-ng](https://github.com/manniwatch/manniwatch/tree/master/packages/client-ng) | [![npm version](https://badge.fury.io/js/%40manniwatch%2Fclient-ng.svg)](https://badge.fury.io/js/%40manniwatch%2Fclient-ng) | [![codecov](https://codecov.io/gh/manniwatch/manniwatch/branch/master/graph/badge.svg?flag=ClientNg)](https://codecov.io/gh/manniwatch/manniwatch/tree/master/packages/client-ng) |
| [client-desktop](https://github.com/manniwatch/manniwatch/tree/master/packages/client-desktop) | [![npm version](https://badge.fury.io/js/%40manniwatch%2Fclient-desktop.svg)](https://badge.fury.io/js/%40manniwatch%2Fclient-desktop) | [![codecov](https://codecov.io/gh/manniwatch/manniwatch/branch/master/graph/badge.svg?flag=ClientDesktop)](https://codecov.io/gh/manniwatch/manniwatch/tree/master/packages/client-desktop) |
| [vehicle-cache](https://github.com/manniwatch/manniwatch/tree/master/packages/vehicle-cache) | [![npm version](https://badge.fury.io/js/%40manniwatch%2Fvehicle-cache.svg)](https://badge.fury.io/js/%40manniwatch%2Fvehicle-cache) | [![codecov](https://codecov.io/gh/manniwatch/manniwatch/branch/master/graph/badge.svg?flag=VehicleCache)](https://codecov.io/gh/manniwatch/manniwatch/tree/master/packages/vehicle-cache) |
| [express-utils](https://github.com/manniwatch/manniwatch/tree/master/packages/express-utils) | [![npm version](https://badge.fury.io/js/%40manniwatch%2Fexpress-utils.svg)](https://badge.fury.io/js/%40manniwatch%2Fexpress-utils) | [![codecov](https://codecov.io/gh/manniwatch/manniwatch/branch/master/graph/badge.svg?flag=ExpressUtils)](https://codecov.io/gh/manniwatch/manniwatch/tree/master/packages/express-utils) |


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/water.png)](#build--test)

## ➤ Build & Test
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


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/water.png)](#docker)

## ➤ Docker

See [this repository](https://github.com/manniwatch/docker) for a Docker Container
