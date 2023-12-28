/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

/**
 * Reads the angular app version from the package file
 * @returns The current app version
 */
import packageInfo from '../../package.json';
export const APP_VERSION: string = packageInfo.version;
