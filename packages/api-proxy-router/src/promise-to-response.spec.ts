/*!
 * Source https://github.com/manniwatch/manniwatch Package: trapeze-api-proxy-router
 */

import { expect } from 'chai';
import * as express from 'express';
import 'mocha';
import { Root } from 'protobufjs';
import * as supertest from 'supertest';
import { promiseToResponse, IMessageType } from './promise-to-response';
const testProtoDefinition: any = {
    'nested': {
        'TestMessage': {
            'fields': {
                'testField': {
                    'id': 1,
                    'type': 'string',
                },
            },
        },
    },
};
interface IResponse {
    testField: string;
}
const testRoot: Root = Root.fromJSON(testProtoDefinition);
const testMessage: any = testRoot.lookupType('TestMessage');
const setupTestApp: <T extends object>(prom: Promise<T>, proto: IMessageType<T>, hasNext?: boolean) => express.Application =
    <T extends object>(prom: Promise<T>, proto: IMessageType<T>, hasNext: boolean = true): express.Application => {
        return express().use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
            if (hasNext) {
                promiseToResponse(prom, proto, res, next);
            } else {
                promiseToResponse(prom, proto, res);
            }
        })
            .use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
                res.status(999).json(err);
            });
    };

const createDelayedPromiseRejection: (err: any) => Promise<object> = (err: any): Promise<object> => {
    return new Promise<object>((resolve: (val: any) => void, reject: (reason?: any) => void): void => {
        setTimeout((): void => reject(err), 250);
    });
};
describe('promise-to-response.ts', (): void => {
    describe('promiseToResponse(prom,res)', (): void => {
        const testRep: IResponse = { testField: 'any test' };
        describe('promise resolves', (): void => {
            let testApp: express.Application;
            before((): void => {
                testApp = setupTestApp(Promise.resolve(testRep), testMessage);
            });
            it('should resolve with the result and return a protobuffer', (): Promise<void> => {
                return supertest(testApp)
                    .get('/users')
                    .set('Accept', 'application/octet-stream')
                    .expect('Content-Type', /^application\/octet\-stream/)
                    .expect(200)
                    .then((response: supertest.Response): void => {
                        expect(response.body).to.deep.equal(testMessage.encode(testRep).finish());
                    });
            });
            it('should resolve with the result and return a json object', (): Promise<void> => {
                return supertest(testApp)
                    .get('/users')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /^application\/json/)
                    .expect(200)
                    .then((response: supertest.Response): void => {
                        expect(response.body).to.deep.equal(testRep);
                    });
            });
            it('should return a Bad Request if a unknown Accept header is provided ', (): Promise<void> => {
                return supertest(testApp)
                    .get('/users')
                    .set('Accept', 'text/html')
                    .expect('Content-Type', /^application\/json/)
                    .expect(400, { status: 400, message: 'Bad Request' })
                    .then((): void => { });
            });
        });
        describe('promise rejects', (): void => {
            const testAcceptHeaders: string[] = ['application/octet-stream', 'application/json', 'text/html'];
            describe('next callback is provided', (): void => {
                testAcceptHeaders.forEach((testAcceptHeader: string): void => {
                    it('should call the next method with the source error and Accept Header set to "' + testAcceptHeader + '"',
                        (): Promise<void> => {
                            const testApp: express.Application = setupTestApp(createDelayedPromiseRejection(testRep), testMessage);
                            return supertest(testApp)
                                .get('/users')
                                .set('Accept', 'application/octet-stream')
                                .expect(999)
                                .expect('Content-Type', /^application\/json/)
                                .expect(testRep)
                                .then((): void => { });
                        });
                });
            });
            /*
            describe('no next callback is provided', (): void => {
                testAcceptHeaders.forEach((testAcceptHeader: string): void => {
                    it('should return a 500 if no statusCode is attached to the error and Accept Header set to "' + testAcceptHeader + '"',
                        (): Promise<void> => {
                            const testApp: express.Application = setupTestApp(Promise.reject(testRep), testMessage, false);
                            return supertest(testApp)
                                .get('/users')
                                .set('Accept', 'application/json')
                                .expect('Content-Type', /^application\/json/)
                                .expect(500)
                                .expect({
                                    message: "An error occured",
                                    statusCode: 500,
                                })
                                .catch(() => { })
                                .then((): void => { });
                        });
                    it('should return the provided statusCode attached to the error and Accept Header set to "' + testAcceptHeader + '"',
                        (): Promise<void> => {
                            const testPromise: Promise<any> = Promise.reject(Object.assign({ statusCode: 529 }, testRep));
                            const testApp: express.Application = setupTestApp(testPromise, testMessage, false);
                            return supertest(testApp)
                                .get('/users')
                                .set('Accept', 'application/json')
                                .expect('Content-Type', /^application\/json/)
                                .expect(529)
                                .catch((response: supertest.Response): void => {
                                    expect(response.body).to.deep.equal({
                                        message: "An error occured",
                                        statusCode: 529,
                                    });
                                })
                                .catch(() => { })
                                .then(() => {

                                });
                        });
                });
            });*/
        });
    });
});
