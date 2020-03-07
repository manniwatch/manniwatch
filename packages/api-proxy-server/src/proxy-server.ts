/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-server
 */

import { createApiProxyRouter } from '@manniwatch/api-proxy-router';
import * as express from 'express';
import * as helmet from 'helmet';
import { Server } from 'http';
import { resolve as pathResolve } from 'path';
export const api404Handler: express.RequestHandler = (req: express.Request,
    res: express.Response,
    next: express.NextFunction): void => {
    res.status(404).json({
        statusCode: 404,
    });
};
/**
 * Common error catcher
 */
export const serverErrorHandler: express.ErrorRequestHandler = (err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction): void => {
    // tslint:disable-next-line:no-console
    console.error(err);
    res.status(500).json({ error: true });
};
export class ManniWatchProxyServer {
    private app: express.Application;
    private server: Server;
    private readonly ngModulePath: string = pathResolve(__dirname +
        './../node_modules/@manniwatch/client-ng/dist/client-ng');
    constructor(public readonly endpoint: string,
        public readonly port: number) {
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
            res.status(404).sendFile(this.ngModulePath + '/index.html');
        });
        this.app.use(serverErrorHandler);
    }

    public start(): void {
        this.server = this.app.listen(this.port);
    }

    public stop(): void {
        this.server.close((err: any): void => {
            // tslint:disable-next-line:no-console
            console.log('Server closed', err);
        });
    }
}
