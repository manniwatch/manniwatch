/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { AppConfig } from './config';
import { validateConfigFile } from './validate-file-config';

export const loadConfig = async (cfgPath: string): Promise<AppConfig> => {
    const resolvedPath: string = resolve(cfgPath);
    const fileContent: string = await readFile(resolvedPath, 'utf-8');
    const parsedContent: AppConfig = JSON.parse(fileContent);
    validateConfigFile(parsedContent);
    parsedContent.configs = [resolvedPath];
    return parsedContent;
};
