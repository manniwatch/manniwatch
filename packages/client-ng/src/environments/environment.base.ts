/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

export interface IEnvironmentBase {
    readonly apiEndpoint: string;
    readonly production: boolean;
    readonly pwa?: boolean;
    readonly version: string;
}
