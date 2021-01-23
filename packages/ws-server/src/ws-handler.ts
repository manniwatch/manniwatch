/*!
 * Source https://github.com/manniwatch/manniwatch Package: ws-server
 */

import { Server as HttpServer } from 'http';
import * as socketio from 'socket.io';
import { handleSocket } from './socket-handler';

export class ManniWatchWsServer {

    private io: socketio.Server;
    public constructor(server: HttpServer) {
        this.io = new socketio.Server(server, { path: '/ws' });
        this.io.on('connection', (client: socketio.Socket): void => {
            handleSocket(client);
        });
    }
}
