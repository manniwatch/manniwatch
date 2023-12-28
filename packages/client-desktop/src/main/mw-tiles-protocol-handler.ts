/*
 * Package @manniwatch/client-desktop
 * Source https://manniwatch.github.io/manniwatch/
 */

/* eslint-disable @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-argument,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-return,
  sort-keys */
import { Protocol, ProtocolRequest, ProtocolResponse } from 'electron';
type HandlerType = Parameters<Protocol['registerHttpProtocol']>[1];
export const createMwTilesHttpProtocolHandler: () => HandlerType = (): HandlerType => {
    return (request: ProtocolRequest, callback: (response: ProtocolResponse) => void): void => {
        const transformed: string = `https://d1u6l41epxe4hw.cloudfront.net/tiles${request.url.substr('tiles://vector'.length)}`;
        callback({
            url: transformed,
        });
    };
};
