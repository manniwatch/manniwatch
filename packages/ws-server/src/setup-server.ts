/*!
 * Source https://github.com/manniwatch/manniwatch Package: @manniwatch/ws-server
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { } from '@manniwatch/pb-converter';
import { Server } from 'http';
import { Observable, Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import * as socketio from 'socket.io';
import { CacheMessage } from './cache-message';
import { createEndlessPollObservable, createVehicleUpdateStream } from './poll-vehicles';

export class ManniwatchWsServer {
    public socketServer: socketio.Server;
    private vehicleObservable: Observable<CacheMessage>;
    constructor(server: Server,
        client: ManniWatchApiClient,
        serveClient: boolean = false) {
        this.vehicleObservable = createEndlessPollObservable(client, 10000)
            .pipe(createVehicleUpdateStream, shareReplay(1));
        this.socketServer = socketio(server, {
            serveClient,
        });
        this.socketServer.on('connection', (socket: socketio.Socket): void => {
            const subscription: Subscription = this.vehicleObservable
                .subscribe({
                    complete: (): void => {
                        socket.disconnect(true);
                    },
                    next: (time: CacheMessage): void => {
                        socket.emit('vehicleUpdate', time);
                    },
                });
            socket.on('disconnect', (): void => {
                subscription.unsubscribe();
            });
        });
    }
}
