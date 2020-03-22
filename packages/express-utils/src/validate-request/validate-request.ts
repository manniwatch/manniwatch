/*!
 * Source https://github.com/manniwatch/manniwatch Package: express-utils
 */

import { NextFunction, Request, RequestHandler, Response } from 'express';
import { validate, Schema, ValidatorResult } from 'jsonschema';
import { convertValidationError } from './convert-validation-error';
export type ObjectSchema = Schema & {
    type: 'object',
};
export interface IValidationSchemas {
    body?: ObjectSchema;
    params?: ObjectSchema;
    query?: ObjectSchema;
}
export const validateRequest: (schemas: IValidationSchemas) => RequestHandler =
    (schemas: IValidationSchemas): RequestHandler => {
        return (req: Request, res: Response, next: NextFunction): void => {
            const ops: string[] = ['query', 'params', 'body'];
            for (const operation of ops) {
                if (!(operation in schemas)) {
                    continue;
                }
                const result: ValidatorResult = validate(req[operation], schemas[operation]);
                if (!result.valid) {
                    next(convertValidationError(result.errors[0], 'query'));
                }
            }
            next();
        };
    };
