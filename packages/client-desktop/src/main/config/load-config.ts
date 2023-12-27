/*
 * Package @manniwatch/client-desktop
 * Source https://manniwatch.github.io/manniwatch/
 */

import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { AppConfig } from './config';
import { validateConfigFile } from './validate-file-config';

/* eslint-disable @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-argument,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-return,
  sort-keys */
export const loadConfig = async (cfgPath: string): Promise<AppConfig> => {
    const resolvedPath: string = resolve(cfgPath);
    const fileContent: string = await readFile(resolvedPath, 'utf-8');
    const parsedContent: AppConfig = JSON.parse(fileContent);
    await validateConfigFile(parsedContent);
    parsedContent.configs = [resolvedPath];
    return parsedContent;
};
