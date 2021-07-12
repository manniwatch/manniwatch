/*!
 * Source https://github.com/manniwatch/manniwatch Package: ws-server
 */

import { Subscription } from 'rxjs';
import * as socketio from 'socket.io';
import { VehicleCache } from '@manniwatch/vehicle-cache';
export const handleSocket = (socket: socketio.Socket,
    cacheClient: VehicleCache): void => {
    let cacheSubscription: Subscription;
    socket.on('connect', (): void => {
        cacheSubscription = cacheClient
            .eventObservable
            .subscribe({
                error: (): void => {
                },
                next: (stat): void => {
                    socket.send(stat);
                }
            })
    });
    socket.on('disconnect', (reason: string): void => {
        cacheSubscription.unsubscribe();
    });
};
