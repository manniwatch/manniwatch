/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import * as prom from '@donmahallem/turbo';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { expect } from 'chai';
import express from 'express';
import 'mocha';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import supertest from 'supertest';
import { SUCCESS_RESPONSE, SUCCESS_RESPONSE_LENGTH } from './common-test.spec';

describe('endpoints/settings.ts', (): void => {
    describe('createSettingsRouter', (): void => {
        let app: express.Express;
        let promiseStub: sinon.SinonStub;
        let getSettingsStub: sinon.SinonStub;
        let apiClientStub: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        let createSettingsRouter: any;
        before((): void => {
            promiseStub = sinon.stub(prom, 'promiseToResponse');
            getSettingsStub = sinon.stub();
            apiClientStub = sinon.createStubInstance(ManniWatchApiClient, {
                getSettings: getSettingsStub as any,
            });
            createSettingsRouter = proxyquire('./settings', {
                '@donmahallem/turbo': {
                    promiseToResponse: promiseStub,
                },
            }).createSettingsRouter;
        });

        beforeEach((): void => {
            const route: express.Router = createSettingsRouter(apiClientStub as any);
            app = express();
            app.use('/settings', route);
        });
        afterEach('test and reset promise stub', (): void => {
            expect(promiseStub.callCount).to.equal(1);
            promiseStub.resetHistory();
            getSettingsStub.resetHistory();
        });
        after((): void => {
            promiseStub.restore();
        });
        describe('query \'\'', (): void => {
            it('should pass on the provided parameters', (): Promise<void> => {
                getSettingsStub.resolves(SUCCESS_RESPONSE);
                promiseStub.callsFake((source: Promise<any>, res: express.Response, next: express.NextFunction): void => {
                    source
                        .then((responseObject: any): void => {
                            res.json(responseObject);
                        });
                });
                return supertest(app)
                    .get('/settings')
                    .expect('Content-Type', /json/)
                    .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                    .expect(200, SUCCESS_RESPONSE)
                    .then((res: supertest.Response): void => {
                        expect(apiClientStub.getSettings.callCount)
                            .to.equal(1, 'getSettings should only be called once');
                    });
            });
        });
    });
});
