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


| Name                                             | Description                                      | Version                                          |
|--------------------------------------------------|--------------------------------------------------|--------------------------------------------------|
| [@manniwatch/api-client](https://manniwatch.github.io/manniwatch/) | Node Client to consume the Api                   | <a href="https://badge.fury.io/js/%40manniwatch%2Fapi-client"><img alt="npm version" src="https://badge.fury.io/js/%40manniwatch%2Fapi-client.svg" height="20"/></a> |
| [@manniwatch/api-proxy-router](https://manniwatch.github.io/manniwatch/) | An express api router used to proxy requests to the upstream server | <a href="https://badge.fury.io/js/%40manniwatch%2Fapi-proxy-router"><img alt="npm version" src="https://badge.fury.io/js/%40manniwatch%2Fapi-proxy-router.svg" height="20"/></a> |
| [@manniwatch/api-proxy-server](https://manniwatch.github.io/manniwatch/) | Server Helper helper for TrapezeApi              | <a href="https://badge.fury.io/js/%40manniwatch%2Fapi-proxy-server"><img alt="npm version" src="https://badge.fury.io/js/%40manniwatch%2Fapi-proxy-server.svg" height="20"/></a> |
| [@manniwatch/api-types](https://manniwatch.github.io/manniwatch/) | Api Types and helper for Trapeze Api             | <a href="https://badge.fury.io/js/%40manniwatch%2Fapi-types"><img alt="npm version" src="https://badge.fury.io/js/%40manniwatch%2Fapi-types.svg" height="20"/></a> |
| [@manniwatch/assets](https://manniwatch.github.io/manniwatch/) | Package holding shared assets for manniwatch     | <a href="https://badge.fury.io/js/%40manniwatch%2Fassets"><img alt="npm version" src="https://badge.fury.io/js/%40manniwatch%2Fassets.svg" height="20"/></a> |
| [@manniwatch/client-desktop](https://manniwatch.github.io/manniwatch/) | An electron app that wraps the manniwatch web app | <a href="https://badge.fury.io/js/%40manniwatch%2Fclient-desktop"><img alt="npm version" src="https://badge.fury.io/js/%40manniwatch%2Fclient-desktop.svg" height="20"/></a> |
| [@manniwatch/client-ng](https://manniwatch.github.io/manniwatch/) | Angular Client for Manniwatch                    | <a href="https://badge.fury.io/js/%40manniwatch%2Fclient-ng"><img alt="npm version" src="https://badge.fury.io/js/%40manniwatch%2Fclient-ng.svg" height="20"/></a> |
| [@manniwatch/client-types](https://manniwatch.github.io/manniwatch/) | Api Types and helper for Client Api              | <a href="https://badge.fury.io/js/%40manniwatch%2Fclient-types"><img alt="npm version" src="https://badge.fury.io/js/%40manniwatch%2Fclient-types.svg" height="20"/></a> |
| [@manniwatch/pb-converter](https://manniwatch.github.io/manniwatch/) | Api Types and helper for Trapeze Api             | <a href="https://badge.fury.io/js/%40manniwatch%2Fpb-converter"><img alt="npm version" src="https://badge.fury.io/js/%40manniwatch%2Fpb-converter.svg" height="20"/></a> |
| [@manniwatch/pb-types](https://manniwatch.github.io/manniwatch/) | PB Types and helper for Trapeze Api              | <a href="https://badge.fury.io/js/%40manniwatch%2Fpb-types"><img alt="npm version" src="https://badge.fury.io/js/%40manniwatch%2Fpb-types.svg" height="20"/></a> |
| [@manniwatch/schemas](https://manniwatch.github.io/manniwatch/) | An express api router used to proxy requests to the upstream server | <a href="https://badge.fury.io/js/%40manniwatch%2Fschemas"><img alt="npm version" src="https://badge.fury.io/js/%40manniwatch%2Fschemas.svg" height="20"/></a> |
| [@manniwatch/vehicle-cache](https://manniwatch.github.io/manniwatch/) | Caching for vehicle locations                    | <a href="https://badge.fury.io/js/%40manniwatch%2Fvehicle-cache"><img alt="npm version" src="https://badge.fury.io/js/%40manniwatch%2Fvehicle-cache.svg" height="20"/></a> |
| [@manniwatch/vehicle-location-diff](https://manniwatch.github.io/manniwatch/) | Tool to calculate diff between vehicle location snapshots | <a href="https://badge.fury.io/js/%40manniwatch%2Fvehicle-location-diff"><img alt="npm version" src="https://badge.fury.io/js/%40manniwatch%2Fvehicle-location-diff.svg" height="20"/></a> |



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
