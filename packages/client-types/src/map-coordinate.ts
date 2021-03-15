/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-types
 */

export enum CoordinateFormat {
    ARC_MILISECOND = 'arcms',
    ARC_SECOND = 'arcs',
    ARC_MINUTE = 'arcm',
    ARC_HOUR = 'arch',
}

export interface IMapCoordinate<F extends CoordinateFormat = CoordinateFormat.ARC_MILISECOND> {
    /**
     * Default: ARC_MILISECOND
     */
    format?: F;
    lat: number;
    lon: number;
}

const getFactor = (format: CoordinateFormat): number => {
    switch (format) {
        case CoordinateFormat.ARC_HOUR:
            return 3600000;
        case CoordinateFormat.ARC_MINUTE:
            return 60000;
        case CoordinateFormat.ARC_SECOND:
            return 1000;
        case CoordinateFormat.ARC_MILISECOND:
        default:
            return 1;
    }
};
export const convertTo = <F extends CoordinateFormat = CoordinateFormat.ARC_MILISECOND,
    T extends CoordinateFormat = CoordinateFormat.ARC_MILISECOND>(coord: IMapCoordinate<F>, to: T): IMapCoordinate<T> => {
    const sourceFormat: CoordinateFormat = coord.format || CoordinateFormat.ARC_MILISECOND;
    if (sourceFormat === to) {
        return {
            format: to,
            lat: coord.lat,
            lon: coord.lon,
        };
    }
    const sourceFactor: number = getFactor(sourceFormat);
    const targetFormat: number = getFactor(to);
    return {
        format: to,
        lat: coord.lat * sourceFactor / targetFormat,
        lon: coord.lon * sourceFactor / targetFormat,
    };
};
