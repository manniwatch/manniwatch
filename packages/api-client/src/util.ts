/*
 * Package @manniwatch/api-client
 * Source https://manniwatch.github.io/manniwatch/
 */


import {
    ISettings,
} from '@manniwatch/api-types';

export class Util {
    public static transformSettingsBody(body: string): ISettings {
        const bracketStart: number = body.indexOf('{');
        const bracketEnd: number = body.lastIndexOf('}');
        if (bracketStart >= 0 && bracketEnd > bracketStart) {
            return JSON.parse(body.substring(bracketStart, bracketEnd + 1)) as ISettings;
        }
        throw new Error('non valid response body');
    }
}
