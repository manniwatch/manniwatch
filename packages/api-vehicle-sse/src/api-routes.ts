/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-vehicle-sse
 */

import { Request, Response, RequestHandler, NextFunction } from 'express';
import { Observable, Subscription } from 'rxjs';

export interface ISseEvent {
    id: string;
    type: string;
    data: string;
}
export const createSseStreamHandler: (obs: Observable<ISseEvent>) => RequestHandler =
    (inputObservable: Observable<ISseEvent>): RequestHandler => {
        return (req: Request, res: Response, next: NextFunction): void => {
            res.writeHead(200, {
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
                'Content-Type': 'text/event-stream',
                'X-Accel-Buffering': 'no',
            });
            res.flushHeaders();
            const subscription: Subscription = inputObservable
                .subscribe((data: ISseEvent): void => {
                    res.write(`id: ${data.id}\n`);
                    res.write(`event: ${data.type}\n`);
                    res.write(`data: ${data.data}\n\n`);
                }, (err?: any): void => {
                    res.end();
                }, (): void => {
                    res.end();
                });
            req.on('close', (...args: any[]): void => {
                subscription.unsubscribe();
            });
            /*
            res.on('error', (...args: any[]): void => {
                console.log('res error', args);
                subscription.unsubscribe();
            });
            req.on('close', (...args: any[]): void => {
                console.log('req close', args);
                subscription.unsubscribe();
            });*/
        };
    };
