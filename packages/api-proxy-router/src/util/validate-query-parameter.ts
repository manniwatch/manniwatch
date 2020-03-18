/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { NextFunction, Request, RequestHandler, Response } from 'express';
import { validate, Schema, ValidationError, ValidatorResult } from 'jsonschema';
import { ProxyError } from '../proxy-error';

export const validateQueryParameter: (schema: Schema) => RequestHandler =
    (schema: Schema): RequestHandler => {
        return (req: Request, res: Response, next: NextFunction): void => {
            const result: ValidatorResult = validate(req.query, schema);
            if (result.valid) {
                next();
            } else {
                const error: ValidationError = result.errors[0];
                if (typeof error.schema === 'string') {
                    next(new ProxyError(400, 'Invalid query parameter \'' + error.schema + '\''));
                } else if (error.name === 'required') {
                    next(new ProxyError(400, 'Invalid query parameter \'' + error.argument + '\''));
                }
            }
        };
    };
