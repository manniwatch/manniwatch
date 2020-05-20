import { ManniWatchApiClient } from '@manniwatch/api-client';
import { Server } from 'http';
import * as socketio from 'socket.io';
import { Subscription, timer } from 'rxjs';

export class ManniwatchWsServer {
    public socketServer: socketio.Server;
    constructor(server: Server,
        client: ManniWatchApiClient) {
        this.socketServer = socketio(server, {
            serveClient: false,
        });
        this.socketServer.on('connection', (socket: socketio.Socket): void => {
            const subscription: Subscription = timer(0, 1000)
                .subscribe({
                    complete: (): void => {
                        socket.disconnect(true);
                    },
                    next: (time: number): void => {
                        socket.emit('vehicleUpdate', time);
                    },
                });
            socket.on('disconnect', (): void => {
                subscription.unsubscribe();
            });
        });
    }
}
