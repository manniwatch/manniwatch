/*!
 * Source https://github.com/manniwatch/manniwatch Package: ws-server
 */

import { map, distinctUntilChanged, flatMap, mergeMap, switchMap } from 'rxjs/operators';
import { Server as HttpServer } from 'http';
import * as socketio from 'socket.io';
import { handleSocket } from './socket-handler';
import { VehicleCache } from '../../vehicle-cache/dist';
import { ConnectionTracker } from './connection-tracker';
import { NEVER, Observable, OperatorFunction, timer } from 'rxjs';

export class ManniWatchWsServer {
    private connectionTracker: ConnectionTracker = new ConnectionTracker();
    private io: socketio.Server;
    private cacheClient: VehicleCache;
    public constructor(server: HttpServer) {
        this.cacheClient = new VehicleCache();
        this.io = new socketio.Server(server, { path: '/ws' });
        this.io.on('connection', (client: socketio.Socket): void => {
            this.connectionTracker.track(client);
            handleSocket(client, this.cacheClient);
        });

        this.connectionTracker
            .connections
            .pipe(map((numConnections: number): boolean => numConnections > 0),
                distinctUntilChanged(),
                switchMap((value: boolean): Observable<number> => {
                    if (value === true) {
                        return timer(0, 1000);
                    } else {
                        return NEVER;
                    }
                }))
    }
}
