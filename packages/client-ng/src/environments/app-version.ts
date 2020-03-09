/**
 * Reads the angular app version from the package file
 * @returns The current app version
 */
// tslint:disable:only-arrow-functions
export function getAppVersion(): AppVersion {
    return require('../../package.json').version;
}
// tslint:enable:only-arrow-functions

/**
 * @ignore
 */
enum AppVersionEnum { }
/**
 * App Version
 */
export type AppVersion = AppVersionEnum & string;
