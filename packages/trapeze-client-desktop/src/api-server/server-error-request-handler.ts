/*!
 * Source https://github.com/donmahallem/trapeze
 */

import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
export const createErrorRequestHandler: () => ErrorRequestHandler = (): ErrorRequestHandler =>
    (err: any,
     req: Request,
     res: Response,
     next: NextFunction): void => {
        // tslint:disable-next-line:no-console
        console.error(err);
        res.status(500).json({ error: true });
    };
