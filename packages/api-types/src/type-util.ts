/*
Source: https://github.com/manniwatch/manniwatch
Package: @manniwatch/api-types
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
