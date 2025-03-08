/*
 * Package @manniwatch/api-proxy-server
 * Source https://manniwatch.github.io/manniwatch/
 */

import { createApiProxyRouter } from '@manniwatch/api-proxy-router';
import express from 'express';
import { Server } from 'http';
import { api404Handler } from './api-not-found-handler.js';
import { serverErrorHandler } from './server-error-handler.js';

export class ManniWatchApiProxyServer {
    private app: express.Application;
    private server: Server;
    constructor(
        public readonly endpoint: string,
        public readonly port: number
    ) {
        this.app = express();
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
            res.set({
                'X-Powered-By': `Manniwatch-Api/__BUILD_VERSION__`,
            });
            next();
        });
        this.app.get('/api/live', (req, res, next) => {
            res.json({ success: true });
        });
        this.app.use('/api', createApiProxyRouter(endpoint));
        this.app.use(api404Handler);
        this.app.use(serverErrorHandler);
    }

    public start(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Promise((resolve: () => void, reject: (err: any) => void): void => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.server = this.app.listen(this.port, (err?: any): void => {
                err ? reject(err) : resolve();
            });
        });
    }

    public stop(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Promise((resolve: () => void, reject: (err: any) => void): void => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.server.close((err: any): void => {
                err ? reject(err) : resolve();
            });
        });
    }
}
