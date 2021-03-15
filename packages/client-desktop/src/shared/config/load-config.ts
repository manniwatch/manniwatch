/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { IConfig } from './config';

export const loadConfig = (): IConfig => {
    return {
        dev: false,
        endpoint: new URL('https://any.url'),
    };
};
