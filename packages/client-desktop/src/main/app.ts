/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { app, ipcMain, protocol, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { IpcMainInvokeEvent } from 'electron/main';
import { resolve } from 'path';
import { createApiHandler } from './api-handler';
import { AppConfig } from './config/config';
import { createMwFileProtocolHandler } from './mw-file-protocol-handler';
import { createMwTilesHttpProtocolHandler } from './mw-tiles-protocol-handler';

export class ManniWatchApp {

    /**
     * Main Window
     */
    private mainWindow: Electron.BrowserWindow;
    /**
     * Client APP
     * @param config Config to be setup
     */
    public constructor(private readonly config: AppConfig) {
    }

    /**
     * Inits the client and starts up the app
     */
    public async init(): Promise<void> {
        protocol.registerSchemesAsPrivileged([
            {
                privileges: {
                    bypassCSP: true,
                    corsEnabled: false,
                    secure: true,
                    standard: true,
                },
                scheme: 'mw',
            },
            {
                privileges: {
                    bypassCSP: true,
                    corsEnabled: false,
                    secure: true,
                    standard: true,
                },
                scheme: 'tiles',
            },
        ]);
        app.on('ready', this.createWindow.bind(this));

        app.on('window-all-closed', (): void => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', (): void => {
            if (this.mainWindow === null) {
                this.createWindow();
            }
        });
    }

    private createWindow(): void {
        // create the browser window.
        createApiHandler(new ManniWatchApiClient(this.config.endpoint));
        protocol.registerFileProtocol('mw', createMwFileProtocolHandler());
        protocol.registerHttpProtocol('tiles', createMwTilesHttpProtocolHandler());
        const browserConfig: BrowserWindowConstructorOptions = {
            height: 600,
            icon: `${app.getAppPath()}/../../icon.png`,
            minHeight: 480,
            minWidth: 640,
            title: 'ManniWatchClient',
            webPreferences: {
                allowRunningInsecureContent: false,
                contextIsolation: true,
                devTools: this.config.debug,
                javascript: true,
                nodeIntegration: true,
                preload: resolve(`${app.getAppPath()}./../preload/prerender.js`),
                sandbox: true,
                webSecurity: true,
            },
            width: 800,
        };
        this.mainWindow = new BrowserWindow(browserConfig);
        // tslint:disable-next-line:no-null-keyword
        this.mainWindow.autoHideMenuBar = false;
        this.mainWindow.loadURL(`mw://static/index.html`);

        if (this.config.debug) {
            this.mainWindow.webContents.openDevTools({
                mode: 'right',
            });
        }

        // emitted when the window is closed.
        this.mainWindow.on('closed', (): void => {
            // dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            this.mainWindow = undefined as any;
        });
        ipcMain.handle('getEnvironment', (event: IpcMainInvokeEvent, ...args: any[]): void => {
            event.returnValue = {
                apiEndpoint: 'mwa://api',
                map: {
                    center: {
                        lat: 195497852,
                        lon: 36428988,
                    },
                    /**
                     * Map Provider to be used
                     * Defaults to 'osm'
                     */
                    mapProvider: {
                        options: {
                            // format: new MVT(),
                            maxZoom: 14,
                            /**
                             * Please replace with correct url
                             * This one doesnt work!
                             */
                            url: 'tiles://vector/{z}/{x}/{y}.pbf',
                        },
                        type: 'vector',
                    },
                    zoom: 10,
                },
                production: false,
            };
        });
    }
}
