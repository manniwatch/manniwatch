/**
 * Package @manniwatch/client-desktop
 * Source https://manniwatch.github.io/manniwatch/
 */

import Ajv from 'ajv';
import { ValidateFunction } from 'ajv/dist/types';
import joo from './../../config-schema.json' assert { type: 'json' };
import { IFileConfig } from '../config/config';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ajvInstance: Ajv = new Ajv();
const validateFunction: ValidateFunction = ajvInstance.compile(joo);
export const validateConfigFile = async (fileContent: any | IFileConfig): Promise<boolean> => {
    if (validateFunction(fileContent)) {
        return true;
    } else {
        // tslint:disable-next-line:no-non-null-assertion
        throw validateFunction.errors![0];
    }
};
