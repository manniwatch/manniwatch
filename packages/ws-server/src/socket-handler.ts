/*!
 * Source https://github.com/manniwatch/manniwatch Package: ws-server
 */

import * as socketio from 'socket.io';
export const handleSocket = (socket: socketio.Socket): void => {
    console.log('Socket established', socket.id);
    let timerId: any;
    socket.on('connect', (): void => {
        console.log(socket.connected); // true
        timerId = setInterval((): void => {
            socket.send('yolo');
        }, 1000);
    });
    socket.on('event', (data: any): void => {

    });
    socket.on('disconnect', (reason: string): void => {
        console.log('disconnected', reason);
        clearInterval(timerId);
    });
};
