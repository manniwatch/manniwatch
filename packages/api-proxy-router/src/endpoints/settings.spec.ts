/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import * as prom from '@donmahallem/turbo';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { expect } from 'chai';
import express from 'express';
import 'mocha';
import NodeCache from 'node-cache';
import proxyquire from 'proxyquire';
import sinon, { SinonFakeTimers } from 'sinon';
import supertest from 'supertest';
import { SUCCESS_RESPONSE, SUCCESS_RESPONSE_LENGTH } from './common-test.spec';

describe('endpoints/settings.ts', (): void => {
    describe('createSettingsRouter', (): void => {
        let app: express.Express;
        let promiseStub: sinon.SinonStub;
        let getSettingsStub: sinon.SinonStub;
        let apiClientStub: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        let fakeCache: sinon.SinonStubbedInstance<NodeCache>;
        let createSettingsRouter: any;
        let sandbox: sinon.SinonSandbox;
        let fakeTimer: SinonFakeTimers;
        before((): void => {
            sandbox = sinon.createSandbox();
            promiseStub = sandbox.stub(prom, 'promiseToResponse');
            getSettingsStub = sandbox.stub();
            apiClientStub = sandbox.createStubInstance(ManniWatchApiClient, {
                getSettings: getSettingsStub as any,
            });
            createSettingsRouter = proxyquire('./settings', {
                '@donmahallem/turbo': {
                    promiseToResponse: promiseStub,
                },
            }).createSettingsRouter;
            fakeCache = sandbox.createStubInstance(NodeCache);
            fakeTimer = sandbox.useFakeTimers(30000);
        });

        beforeEach((): void => {
            const route: express.Router = createSettingsRouter(apiClientStub as any, fakeCache);
            app = express();
            app.use('/settings', route);
        });
        afterEach('test and reset promise stub', (): void => {
            sandbox.reset();
        });
        after((): void => {
            sandbox.restore();
            fakeTimer.restore();
        });
        describe('query \'\'', (): void => {
            it('should pass on the provided parameters', async (): Promise<void> => {
                getSettingsStub.resolves(SUCCESS_RESPONSE);
                promiseStub.callsFake((source: Promise<any>, res: express.Response, next: express.NextFunction): void => {
                    source
                        .then((responseObject: any): void => {
                            res.json(responseObject);
                        });
                });
                fakeCache.get.returns(undefined);
                await supertest(app)
                    .get('/settings')
                    .expect('Content-Type', /json/)
                    .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                    .expect(200, SUCCESS_RESPONSE)
                    .expect('ETag', 'W/"f809b3e2ff34d869ee123b2108961aa6"')
                    .expect('Last-Modified', new Date(30000).toUTCString())
                    .then((res: supertest.Response): void => {
                        expect(apiClientStub.getSettings.callCount)
                            .to.equal(1, 'getSettings should only be called once');
                        expect(promiseStub.callCount).to.equal(1);
                        expect(fakeCache.get.callCount).to.equal(1, 'cache should be queried once');
                        expect(fakeCache.set.callCount).to.equal(1, 'cache should be updated once');
                    });
            });
            it('should return value from cache', async (): Promise<void> => {
                promiseStub.callsFake((source: Promise<any>, res: express.Response, next: express.NextFunction): void => {
                    source
                        .then((responseObject: any): void => {
                            res.json(responseObject);
                        });
                });
                const testLastModified: Date = new Date(10000);
                fakeCache.get.returns({
                    data: SUCCESS_RESPONSE,
                    etag: 'testtag',
                    lastModified: testLastModified,
                });
                await supertest(app)
                    .get('/settings')
                    .expect('Content-Type', /json/)
                    .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                    .expect('ETag', 'W/"testtag"')
                    .expect('Last-Modified', testLastModified.toUTCString())
                    .expect(200, SUCCESS_RESPONSE)
                    .then((res: supertest.Response): void => {
                        expect(apiClientStub.getSettings.callCount)
                            .to.equal(0, 'getSettings should not be called');
                        expect(promiseStub.callCount).to.equal(1);
                        expect(fakeCache.get.callCount).to.equal(1, 'cache should be queried once');
                        expect(fakeCache.set.callCount).to.equal(0, 'cache should not be updated');
                    });
            });
        });
    });
});
