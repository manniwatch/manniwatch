/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { IEnvironmentBase } from '@manniwatch/client-types';

export type Environment = IEnvironmentBase & {
    readonly version: string;
};
