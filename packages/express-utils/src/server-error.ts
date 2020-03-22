/*!
 * Source https://github.com/manniwatch/manniwatch Package: express-utils
 */

export class ServerError extends Error {
    public constructor(public readonly statusCode: number, message: string) {
        super(message);
        this.name = 'ServerError';
    }
}
