/**
 * Package @manniwatch/client-desktop
 * Source https://manniwatch.github.io/manniwatch/
 */

import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { AppConfig } from './config';
import { validateConfigFile } from './validate-file-config';

export const loadConfig = async (cfgPath: string): Promise<AppConfig> => {
    const resolvedPath: string = resolve(cfgPath);
    const fileContent: string = await readFile(resolvedPath, 'utf-8');
    const parsedContent: AppConfig = JSON.parse(fileContent);
    await validateConfigFile(parsedContent);
    parsedContent.configs = [resolvedPath];
    return parsedContent;
};
