/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { IEnvironmentBase } from '@manniwatch/client-types';

export type Environment = IEnvironmentBase & {
    readonly version: string;
};
