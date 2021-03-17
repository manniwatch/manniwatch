/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import Ajv from 'ajv';
import { ValidateFunction } from 'ajv/dist/types';
import { IFileConfig } from '../config/config';

const ajvInstance: Ajv = new Ajv();
// tslint:disable-next-line:no-var-requires
const sourceSchema: any = require('./../../config-schema.json');
const validateFunction: ValidateFunction = ajvInstance.compile(sourceSchema);
export const validateConfigFile = (fileContent: any | IFileConfig): boolean => {
    if (validateFunction(fileContent)) {
        return true;
    } else {
        // tslint:disable-next-line:no-non-null-assertion
        throw validateFunction.errors![0];
    }
};
