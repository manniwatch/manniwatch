
import { expect } from 'chai';
import { Done } from 'mocha';
import * as socketclient from 'socket.io-client';
import * as express from 'express';
import { createServer, Server } from 'http';
import { ManniWatchWsServer } from './ws-handler';

describe('Suite of unit tests', function () {

    let serverApp: express.Application;
    let serverHttp: Server;
    let socketServer: ManniWatchWsServer;
    beforeEach((done: Done): void => {
        //console.log("Open server");
        // Setup Server
        serverApp = express();
        serverHttp = createServer(serverApp);
        socketServer = new ManniWatchWsServer(serverHttp);
        serverHttp.listen(3001, (): void => {
            console.log('SocketServer', socketServer);
            done();
        });
    });

    afterEach((done: Done): void => {
        console.log("close server");
        serverHttp.close((err?: Error): void => {
            if (err) {
                console.error(err);
            }
            console.log("server closed");
            done();
        })
    });



    describe('First (hopefully useful) test', function () {

        let socket: socketclient.Socket;
        beforeEach((done: Done): void => {
            // Setup Client
            socket = socketclient.io('http://localhost:3001', {});
            socket.on('connect', function () {
                console.log('worked...');
                done();
            });
            socket.on('disconnect', function () {
                console.log('disconnected...');
            })
        });

        afterEach((done: Done): void => {
            // Cleanup
            if (socket.connected) {
                console.log('disconnecting...');
                socket.disconnect();
            } else {
                // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
                console.log('no connection to break...');
            }
            done();
        });
        it('Doing some things with indexOf()', (done: Done): void => {
            expect([1, 2, 3].indexOf(5)).to.be.equal(-1);
            expect([1, 2, 3].indexOf(0)).to.be.equal(-1);
            done();
        });

        it('Doing something else with indexOf()', (done: Done): void => {
            expect([1, 2, 3].indexOf(5)).to.be.equal(-1);
            expect([1, 2, 3].indexOf(0)).to.be.equal(-1);
            done();
        });

    });

});