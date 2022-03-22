/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { IEnvironmentBase } from '@manniwatch/client-types';

export type Environment = IEnvironmentBase & {
    readonly version: string;
};
