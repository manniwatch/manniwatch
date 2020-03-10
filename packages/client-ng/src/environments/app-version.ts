/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

/**
 * Reads the angular app version from the package file
 * @returns The current app version
 */
import { version } from '../../package.json';
export const APP_VERSION: string = version;
