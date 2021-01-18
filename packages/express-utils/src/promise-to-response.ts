/*!
 * Source https://github.com/manniwatch/manniwatch Package: express-utils
 */

 import {AxiosError}from'axios';
import { NextFunction, Response } from 'express';

type MethodType = <T>(prom: Promise<T> ,
    res: Response,
    next?: NextFunction) => void;
/**
 * takes promises and passes them on to an express response
 */
export const promiseToResponse: MethodType = <T>(prom: Promise<T>,
    res: Response,
    next?: NextFunction): void => {
    prom
        .then((value: T): void => {
            res.status(200).json(value);
        })
        .catch((err: any | AxiosError): void => {
            if (next) {
                next(err);
            } else if(err.isAxiosError===true){
                const axiosError:AxiosError=err;
                if(axiosError.response){
                    const code: number = axiosError.response.status || 500;
                    res.status(code).json({
                        error: true,
                        statusCode: code,
                    });
                }else{
                    const code: number =  500;
                    res.status(code).json({
                        error: true,
                        message:axiosError.message,
                        statusCode: code,
                    });
                }
            }else{
                const code: number = err.statusCode || 500;
                res.status(code).json({
                    error: true,
                    statusCode: code,
                });
            }
        });
};
