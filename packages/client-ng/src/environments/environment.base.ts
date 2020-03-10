/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

export type BackendType = 'nginx' | 'trapeze';
export interface IEnvironmentBase {
    readonly apiEndpoint: string;
    readonly backendType: BackendType;
    readonly production: boolean;
    readonly pwa?: boolean;
    readonly version: string;
}
