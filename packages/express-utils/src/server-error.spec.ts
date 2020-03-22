/*!
 * Source https://github.com/manniwatch/manniwatch Package: express-utils
 */

import { expect } from 'chai';
import 'mocha';
import { ServerError } from './server-error';
describe('server-error.ts', (): void => {
    describe('ServerError', (): void => {
        it('should create the error correctly', (): void => {
            const testError: ServerError = new ServerError(1234, 'test error');
            expect(testError.name).to.equal('ServerError');
            expect(testError.statusCode).to.equal(1234);
            expect(testError.message).to.equal('test error');
            expect(testError).to.be.instanceOf(ServerError, 'should be a server error');
        });
    });
});
