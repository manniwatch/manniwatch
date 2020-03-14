# Desktop Client

![Sample Logo](https://raw.githubusercontent.com/manniwatch/manniwatch/packages/client-desktop/master/assets/screenshot.png)


[![codecov](https://codecov.io/gh/manniwatch/manniwatch/branch/master/graph/badge.svg?flag=ClientDesktop)](https://codecov.io/gh/manniwatch/manniwatch/tree/master/packages/client-desktop) [![npm version](https://badge.fury.io/js/%40manniwatch%2Fclient-desktop.svg)](https://badge.fury.io/js/%40manniwatch%2Fclient-desktop) [![dependencies Status](https://david-dm.org/manniwatch/manniwatch/status.svg?path=packages/client-desktop)](https://david-dm.org/manniwatch/manniwatch?path=packages/client-desktop) [![devDependencies Status](https://david-dm.org/manniwatch/manniwatch/dev-status.svg?path=packages/client-desktop)](https://david-dm.org/manniwatch/manniwatch?path=packages/client-desktop&type=dev)


## Setup 1 (requires node install)
1. npm install -g @manniwatch/client-desktop
2. run: manniwatch-client [DOMAIN AND PATH OF THE SERVICE]

## Setup 2 (requires node install)
1. Clone ClientElectron
2. Install its dependencies
3. run ng build --aot --prod --base-href=./
4. copy the data inside the dist/client-ng folder to the dist/app folder inside this project
5. run "npm run start -- [DOMAIN AND PATH OF THE SERVICE]"
6. ... it should work

## Setup 3 (requires no seperate node install)
1. Copy the latest app.asar file from the github releases page
2. And proceed with it as described in https://electronjs.org/docs/tutorial/application-distribution
3. Now run this app with the first parameter being the domain where to gather the data from
