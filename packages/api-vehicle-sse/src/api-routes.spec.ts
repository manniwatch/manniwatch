/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-vehicle-sse
 */

import { expect } from 'chai';
import * as express from 'express';
import 'mocha';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import { createSseStreamHandler, ISseEvent } from './api-routes';
import { Subject } from 'rxjs';

// tslint:disable:no-unused-expression
describe('api-routes.ts', (): void => {
    describe('createApiProxyRouter()', function (): void {
        this.timeout(10000);
        let sandbox: sinon.SinonSandbox;
        before((): void => {
            sandbox = sinon.createSandbox();
        });
        afterEach((): void => {
            sandbox.resetHistory();
        });
        after((): void => {
            sandbox.restore();
        });
        describe('setup inner routes', (): void => {
            let app: express.Express;
            let routeErrorSpy: sinon.SinonSpy;
            const testSubject: Subject<ISseEvent> = new Subject();
            before((): void => {
                routeErrorSpy = sinon.spy();
            });
            beforeEach((): void => {
                app = express();
                app.use(createSseStreamHandler(testSubject));
            });
            afterEach((): void => {
                routeErrorSpy.resetHistory();
            });
            describe('test testing setup', (): void => {
                it('should respond with whole array', (done: Mocha.Done): void => {
                    supertest(app)
                        .get('/unknown/route')
                        .expect('Content-Type', /^text\/event-stream/)
                        .expect(200, 'id: 0\nevent: any\ndata: 0\n\n' +
                            'id: 1\nevent: any\ndata: 1\n\n' +
                            'id: 2\nevent: any\ndata: 2\n\n' +
                            'id: 3\nevent: any\ndata: 3\n\n' +
                            'id: 4\nevent: any\ndata: 4\n\n')
                        .then((res: supertest.Response): void => {
                            expect(routeErrorSpy.callCount).to.equal(0);
                            done();
                        })
                        .catch(done);
                    for (let i: number = 0; i < 5; i++) {
                        testSubject.next({
                            data: '' + i,
                            id: '' + i,
                            type: 'any',
                        });
                    }
                    testSubject.complete();
                });
                it('should use the 404 handler', (done: Mocha.Done): void => {
                    const a: supertest.Test = supertest(app)
                        .get('/unknown/route')
                        .expect('Content-Type', /^text\/event-stream/)
                        .expect(200);
                    a.end((resp: supertest.Response): void => {
                        done();
                    });
                    setTimeout((): void => {
                        a.abort();
                        expect(testSubject.isStopped).to.be.true;
                    }, 1500);
                });
            });
        });
    });
});
