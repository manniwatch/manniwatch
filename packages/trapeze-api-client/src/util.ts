/*!
 * Source https://github.com/donmahallem/TrapezeApiTypes
 */

/*!
 * Source https://github.com/donmahallem/TrapezeApiClientNode
 */

import {
    ISettings,
} from '@donmahallem/trapeze-api-types';
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
