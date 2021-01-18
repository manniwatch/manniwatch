/*!
 * Source https://github.com/manniwatch/manniwatch Package: express-utils
 */

import { NextFunction, Request, RequestHandler, Response } from 'express';
import { validate, Schema, ValidatorResult } from 'jsonschema';
import { convertValidationError } from './convert-validation-error';

export type ValidationSchemas = Schema & {
    properties: {
        body?: Schema;
        params?: Schema;
        query?: Schema;
    },
};
export const validateRequest: (schemas: ValidationSchemas) => RequestHandler =
    (schemas: ValidationSchemas): RequestHandler => {
        return (req: Request, res: Response, next: NextFunction): void => {
            const result: ValidatorResult = validate(req, schemas);
            if (!result.valid) {
                const namedProperty: string = (typeof (result.errors[0]?.path[0]) === 'string') ?
                    result.errors[0]?.path[0] :
                    'unknown';
                next(convertValidationError(result.errors[0], namedProperty));
                return;
            }
            next();
        };
    };
