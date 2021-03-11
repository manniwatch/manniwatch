/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import { Protocol, ProtocolRequest, ProtocolResponse } from 'electron';
type HandlerType = Parameters<Protocol['registerHttpProtocol']>[1];
export const createMwTilesHttpProtocolHandler: () => HandlerType = (): HandlerType => {
    return async (request: ProtocolRequest, callback: (response: ProtocolResponse) => void): Promise<void> => {
        const transformed: string = `https://d1u6l41epxe4hw.cloudfront.net/tiles${request.url.substr('tiles://vector'.length)}`;
        callback({
            url: transformed,
        });
    };
};
