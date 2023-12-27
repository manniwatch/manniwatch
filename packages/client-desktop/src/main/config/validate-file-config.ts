/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import Ajv from 'ajv';
import { ValidateFunction } from 'ajv/dist/types';
import { IFileConfig } from '../config/config';
import joo from './../../config-schema.json' assert { type: 'json' };

const ajvInstance: Ajv = new Ajv();
const validateFunction: ValidateFunction = ajvInstance.compile(joo);
// tslint:disable-next-line:no-var-requires
export const validateConfigFile = async (fileContent: any | IFileConfig): Promise<boolean> => {
    if (validateFunction(fileContent)) {
        return true;
    } else {
        // tslint:disable-next-line:no-non-null-assertion
        throw validateFunction.errors![0];
    }
};
