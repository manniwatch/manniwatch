/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-server
 */

import { createApiProxyRouter } from '@manniwatch/api-proxy-router';
import express from 'express';
import helmet from 'helmet';
import { Server } from 'http';
import path from 'path';
import { api404Handler } from './api-not-found-handler';
import { serverErrorHandler } from './server-error-handler';

export class ManniWatchProxyServer {
    private app: express.Application;
    private server: Server;
    private ngModulePath: string;
    constructor(public readonly endpoint: string,
        public readonly port: number,
        public readonly clientFiles?: string) {
        // tslint:disable-next-line:triple-equals
        if (clientFiles == undefined) {
            // Check if @manniwatch/client-ng is installed
            const modulePath: string = require.resolve('@manniwatch/client-ng');
            if (modulePath) {
                this.ngModulePath = path.resolve(path.join(path.dirname(modulePath), 'dist', 'client-ng'));
            } else {
                throw new Error('Could not find @manniwatch/client-ng installed');
            }
        } else {
            this.ngModulePath = clientFiles;
        }

        // setup server
        this.app = express();
        this.app.use(helmet.contentSecurityPolicy({
            directives: {
                connectSrc: ['\'self\'',
                    'https://c.tile.openstreetmap.org',
                    'https://b.tile.openstreetmap.org',
                    'https://a.tile.openstreetmap.org'],
                defaultSrc: ['\'self\''],
                imgSrc: ['\'self\'',
                    'https://c.tile.openstreetmap.org',
                    'https://b.tile.openstreetmap.org',
                    'https://a.tile.openstreetmap.org',
                    'data:'],
                scriptSrc: ['\'self\'', '\'unsafe-inline\''],
                styleSrc: ['\'self\'', '\'unsafe-inline\''],
            },
        }));
        this.app.use('/api', createApiProxyRouter(endpoint));
        this.app.use('/api', api404Handler);
        this.app.use(express.static(this.ngModulePath));
        this.app.get('/*', (req: express.Request, res: express.Response): void => {
            res.status(404).sendFile(`${this.ngModulePath}/index.html`);
        });
        this.app.use(serverErrorHandler);
    }

    public start(): Promise<void> {
        return new Promise((resolve: () => void, reject: (err: any) => void): void => {
            this.server = this.app.listen(this.port, (err?: any): void => {
                err ? reject(err) : resolve();
            });
        });
    }

    public stop(): Promise<void> {
        return new Promise((resolve: () => void, reject: (err: any) => void): void => {
            this.server.close((err: any): void => {
                err ? reject(err) : resolve();
            });
        });
    }
}
