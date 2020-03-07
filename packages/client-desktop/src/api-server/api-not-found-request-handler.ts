/*!
 * Source https://github.com/manniwatch/trapeze
 */

import { NextFunction, Request, RequestHandler, Response } from 'express';
export const createApiNotFoundRequestHandler: () => RequestHandler = (): RequestHandler =>
    (req: Request,
     res: Response,
     next: NextFunction): void => {
        res.status(404).json({
            statusCode: 404,
        });
    };
