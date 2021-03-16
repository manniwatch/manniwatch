/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { readFile } from 'fs/promises';
import { IFileConfig } from './config';
import { validateConfigFile } from './validate-file-config';

export const loadConfig = async (cfgPath: string): Promise<IFileConfig> => {
    const fileContent: string = await readFile(cfgPath, 'utf-8');
    const parsedContent: IFileConfig = JSON.parse(fileContent);
    validateConfigFile(parsedContent);
    return parsedContent;
};
