# Trapeze Desktop Client

![Sample Logo](https://raw.githubusercontent.com/donmahallem/trapeze/packages/trapeze-client-desktop/master/assets/screenshot.png)


[![codecov](https://codecov.io/gh/donmahallem/trapeze/branch/master/graph/badge.svg?flag=TrapezeClientDesktop)](https://codecov.io/gh/donmahallem/trapeze/tree/master/packages/trapeze-client-desktop) [![npm version](https://badge.fury.io/js/%40donmahallem%2Ftrapeze-client-desktop.svg)](https://badge.fury.io/js/%40donmahallem%2Ftrapeze-client-desktop)

## Setup 1 (requires node install)
1. npm install -g @donmahallem/trapeze-client-desktop
2. run: trapeze-client [DOMAIN AND PATH OF THE SERVICE]

## Setup 2 (requires node install)
1. Clone TrapezeClientElectron
2. Install its dependencies
3. run ng build --aot --prod --base-href=./
4. copy the data inside the dist/trapeze-client-ng folder to the dist/app folder inside this project
5. run "npm run start -- [DOMAIN AND PATH OF THE SERVICE]"
6. ... it should work

## Setup 3 (requires no seperate node install)
1. Copy the latest app.asar file from the github releases page
2. And proceed with it as described in https://electronjs.org/docs/tutorial/application-distribution
3. Now run this app with the first parameter being the domain where to gather the data from