/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-server
 */

import { createApiProxyRouter } from '@manniwatch/api-proxy-router';
import express from 'express';
import { Server } from 'http';
import { api404Handler } from './api-not-found-handler';
import { serverErrorHandler } from './server-error-handler';

export class ManniWatchApiProxyServer {
    private app: express.Application;
    private server: Server;
    constructor(public readonly endpoint: string,
        public readonly port: number) {
        this.app = express();
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
            res.set({
                'X-Powered-By': `Manniwatch-Api/__BUILD_VERSION__`,
            });
            next();
        });
        this.app.use('/api', createApiProxyRouter(endpoint));
        this.app.use(api404Handler);
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
