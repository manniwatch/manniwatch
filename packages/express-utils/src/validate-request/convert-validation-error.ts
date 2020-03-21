/*!
 * Source https://github.com/manniwatch/manniwatch Package: express-utils
 */

import { ValidationError } from 'jsonschema';
import { ServerError } from '../server-error';

export const convertValidationError: (error: ValidationError, type: string) => ServerError =
    (error: ValidationError, type: string): ServerError => {
        switch (error.name) {
            case 'required':
                return new ServerError(400, 'Requires ' + type + ' parameter \'' + error.argument + '\'');
            case 'pattern':
            case 'type':
                return new ServerError(400, 'Invalid ' + type + ' ' + error.name);
            default:
                return new ServerError(400, 'Invalid ' + type);
        }
    };
