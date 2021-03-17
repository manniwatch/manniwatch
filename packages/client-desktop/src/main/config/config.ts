/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { CoordinateFormat, IEnvironmentBase, IMapCoordinate } from '@manniwatch/client-types';
import { ICliConfig } from '../cli/cli-config';

interface IFileConfigMap {
    center?: IMapCoordinate<CoordinateFormat>;
    type?: string;
    url?: string | string[];
}
export interface IFileConfig {
    map: IFileConfigMap;
}
export type AppConfig = Omit<ICliConfig, 'config'> & {
    configs: string[],
    environment: IEnvironmentBase,
};
