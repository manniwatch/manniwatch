/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { all as merge } from 'deepmerge';
import { getManniwatchDesktopEnvironment } from 'src/app/util/electron';
import { Environment } from './environment.base';
import { environment as compileEnvironment } from './environment';
import { APP_VERSION } from './app-version';

const sourceEnvironments: any[] = [
    compileEnvironment,
    getManniwatchDesktopEnvironment(),
    {
        version: APP_VERSION,
    }
];

export const environment: Environment = merge<Environment>(sourceEnvironments) as any;
