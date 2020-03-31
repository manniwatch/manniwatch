/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-vehicle-sse
 */

import { Request, Response, RequestHandler, NextFunction } from 'express';
import { Observable, Subscription } from 'rxjs';

export interface ISseEvent {
    id: string,
    type: string,
    data: string,
}
export const createSseStreamHandler: (obs: Observable<ISseEvent>) => RequestHandler =
    (inputObservable: Observable<ISseEvent>): RequestHandler => {
        return (req: Request, res: Response, next: NextFunction): void => {
            res.type('text/event-stream');
            res.set('Cache-Control', 'no-cache');
            res.set('X-Accel-Buffering', 'no');
            const subscription: Subscription = inputObservable.subscribe((data: ISseEvent): void => {
                res.write(`id: ${data.id}\n`);
                res.write(`event: ${data.type}\n`);
                // res.write(`retry: 10000\n`);
                res.write(`data: ${data.data}\n\n`);
            }, (err?: any): void => {

            }, (): void => {
                res.end();
            });
            res.on('close', subscription.unsubscribe);
            res.on('error', subscription.unsubscribe);
        };
    };
