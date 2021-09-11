/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { all as merge } from 'deepmerge';
import { getManniwatchDesktopEnvironment } from 'src/app/util/electron';
import { APP_VERSION } from './app-version';
import { environment as compileEnvironment } from './environment';
import { Environment } from './environment.base';

const sourceEnvironments: Partial<Environment>[] = [
    compileEnvironment,
    getManniwatchDesktopEnvironment(),
    {
        version: APP_VERSION,
    },
];

export const environment: Environment = merge<Environment>(sourceEnvironments) as Environment;
