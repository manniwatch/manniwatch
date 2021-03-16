/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { CoordinateFormat, IMapCoordinate } from '@manniwatch/client-types';

export interface IConfig {
    dev: boolean;
    endpoint: string;
}
interface IFileConfigMap {
    center?: IMapCoordinate<CoordinateFormat>;
    type?: string;
    url?: string | string[];
}
export interface IFileConfig {
    map: IFileConfigMap;
}
