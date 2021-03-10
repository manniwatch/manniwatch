/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import * as crypto from 'crypto';
import { app, BrowserWindow, BrowserWindowConstructorOptions, protocol } from 'electron';
import { join } from 'path';
import { createApiHandler } from './api-handler';
import { IConfig } from './cli-commands';
import { createMwFileProtocolHandler } from './mw-file-protocol-handler';

export class ManniWatchApp {

    /**
     * Main Window
     */
    private mainWindow: Electron.BrowserWindow;
    /**
     * Secure Token to be used for communication between the client and the local api
     */
    private secureToken: string;
    /**
     * Client APP
     * @param config Config to be setup
     */
    public constructor(private readonly config: IConfig) {
        this.secureToken = this.createSecureToken();
    }

    /**
     * creates a random string
     */
    public createSecureToken(): string {
        return crypto.randomBytes(64).toString('hex');
    }

    /**
     * Inits the client and starts up the app
     */
    public async init(): Promise<void> {
        protocol.registerSchemesAsPrivileged([
            {
                scheme: 'mw', privileges: {
                    bypassCSP: true,
                    standard: true,
                    secure: true,
                }
            }
        ])
        app.on('ready', this.createWindow.bind(this));

        app.on('window-all-closed', (): void => {
            if (process.platform !== 'darwin') {
                app.quit();
                //this.apiServer.stop();
            }
        });

        app.on('activate', (): void => {
            if (this.mainWindow === null) {
                this.createWindow();
            }
        });
    }

    public setupNetworkInterceptors(session: Electron.Session): void {
        const filter: Electron.Filter = {
            urls: [
                '*://localhost/*',
            ],
        };
        session.webRequest
            .onBeforeSendHeaders(filter, (details: Electron.OnBeforeSendHeadersListenerDetails, callback: (v: any) => void): void => {
                // tslint:disable-next-line:no-string-literal
                console.log("JJJ")
                details.requestHeaders['Authorization'] = `Bearer ${this.secureToken}`;
                callback({ cancel: false, requestHeaders: details.requestHeaders });
            });
    }

    private createWindow(): void {
        // create the browser window.
        createApiHandler(new ManniWatchApiClient(this.config.endpoint.toString()));
        protocol.registerFileProtocol('mw', createMwFileProtocolHandler());
        //protocol.registerHttpProtocol('mw', createMwHttpProtocolHandler());
        const browserConfig: BrowserWindowConstructorOptions = {
            height: 600,
            icon: `${__dirname}/../icon.png`,
            minHeight: 480,
            minWidth: 640,
            title: 'ManniWatchClient',
            webPreferences: {
                allowRunningInsecureContent: false,
                javascript: true,
                nodeIntegration: true,
                devTools: true,
                webSecurity: true,
                sandbox: true,
                contextIsolation: true,
                preload: join(app.getAppPath(), './../preload/prerender.js')
            },
            width: 800,
        };
        this.mainWindow = new BrowserWindow(browserConfig);
        // register Token Interceptor
        this.setupNetworkInterceptors(this.mainWindow.webContents.session);
        // tslint:disable-next-line:no-null-keyword
        this.mainWindow.autoHideMenuBar = false;
        this.mainWindow.loadURL(`mw://static/index.html`);

        if (this.config.dev) {
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
    }
}
