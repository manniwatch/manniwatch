import * as fs from 'fs';
import { createServer, IncomingMessage, RequestListener, Server, ServerResponse } from 'http';
import * as socketio from 'socket.io';
import { ManniwatchWsServer } from './../src';
import { ManniWatchApiClient } from '@manniwatch/api-client';

const handler: RequestListener = (req: IncomingMessage, res: ServerResponse): void => {
    fs.readFile(__dirname + '/index.html',
        (err: any, data: Buffer): void => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
};

const app: Server = createServer(handler);
const apiClient: ManniWatchApiClient = new ManniWatchApiClient(process.argv[2]);
const io: ManniwatchWsServer = new ManniwatchWsServer(app, apiClient, true);
app.listen(8080);
io.socketServer.on('connection', (socket: socketio.Socket): void => {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', (data: any): void => {
        console.log(data);
    });
});
