/*
 * Package @manniwatch/api-types
 * Source https://manniwatch.github.io/manniwatch/
 */

export type VehicleCategory = string | 'bus' | 'tram';
/**
 * Stop Mode to query
 */
export type StopMode = 'arrival' | 'departure';
/**
 * Should coordinates be corrected or unaltered
 */
export type PositionType = 'CORRECTED' | 'RAW';
