import { readFile } from 'fs';
import { createServer, IncomingMessage, RequestListener, Server, ServerResponse } from 'http';
import * as socketio from 'socket.io';

const handler: RequestListener = (req: IncomingMessage, res: ServerResponse): void {
    readFile(__dirname + '/index.html',
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
const io: socketio.Server = socketio(app);
app.listen(8080);

io.on('connection', (socket: socketio.Socket): void => {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', (data: any): void => {
        console.log(data);
    });
});
