import { AppVersion } from './app-version';

export interface IEnvironmentBase {
    readonly apiEndpoint: string;
    readonly production: boolean;
    readonly pwa?: boolean;
    readonly version: AppVersion;
}
