/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import { createApiProxyRouter } from '@manniwatch/api-proxy-router';
import * as express from 'express';
import * as helmet from 'helmet';
import { Server } from 'http';
import { resolve as pathResolve } from 'path';
import { IApiServerConfig } from './api-server-config';
import { createErrorRequestHandler } from './api-server/server-error-request-handler';
export const api404Handler: express.RequestHandler = (req: express.Request,
    res: express.Response,
    next: express.NextFunction): void => {
    res.status(404).json({
        statusCode: 404,
    });
};
/**
 * Api Server
 */
export class ApiServer {
    private app: express.Application;
    private server: Server;
    private isRunning: boolean = false;
    private readonly ngModulePath: string = pathResolve(__dirname +
        './../node_modules/@manniwatch/client-ng/dist/client-ng');
    /**
     * Api Server for the Api Wrapper
     * @param config Config to be used to start the server
     */
    constructor(public readonly config: IApiServerConfig) {
        this.app = express();
        this.app.use(this.createAuthMiddleware(this.config.secret));
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
        this.app.use('/api', createApiProxyRouter(this.config.endpoint));
        this.app.use('/api', api404Handler);
        this.app.use(express.static(this.ngModulePath));
        this.app.get('/*', (req: express.Request, res: express.Response): void => {
            // tslint:disable-next-line:no-console
            console.info('Not found', req.path);
            res.status(404).sendFile(this.ngModulePath + '/index.html');
        });
        this.app.use(createErrorRequestHandler());
    }
    /**
     * Checks the Auth Header for the Api Token
     * @param secret Secret to be checked in the auth header
     */
    public createAuthMiddleware(secret: string): express.RequestHandler {
        return (req: express.Request,
            res: express.Response,
            next: express.NextFunction): void => {
            // checks if the Authorization Header is set
            if (req.headers.authorization) {
                const splits: string[] = req.headers.authorization.split(' ');
                if (splits.length !== 2) {
                    next(new Error('Bearer token request expected'));
                    return;
                }
                if (splits[0] === 'Bearer' && splits[1] === this.config.secret) {
                    next();
                    return;
                }
            }
            next(new Error('No Authorization Header provided'));
        };
    }

    /**
     * Starts the app server
     */
    public start(): Promise<void> {
        if (this.isRunning) {
            return Promise.resolve();
        }
        return new Promise((resolve: () => void, reject: (err: any) => void): void => {
            this.server = this.app.listen(this.config.port, (...args: any[]) => {
                if (args.length > 0) {
                    reject(args[0]);
                } else {
                    this.isRunning = true;
                    resolve();
                }
            });
        });
    }

    /**
     * Stops the app server
     */
    public stop(): void {
        this.server.close((err: any): void => {
            // tslint:disable-next-line:no-console
            console.log('Server closed', err);
        });
    }
}
