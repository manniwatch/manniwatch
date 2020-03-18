/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

export class ProxyError extends Error {
    public constructor(public readonly statusCode: number, message: string) {
        super(message);
        this.name = 'ProxyError';
    }
}
