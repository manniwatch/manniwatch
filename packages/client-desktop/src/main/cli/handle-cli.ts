/**
 * Package @manniwatch/client-desktop
 * Source https://manniwatch.github.io/manniwatch/
 */

import commander from 'commander';
import { all as mergeAll } from 'deepmerge';
import { ICliConfig } from './cli-config';
import { AppConfig } from '../config/config';
import { loadConfig } from '../config/index';
import { validateConfigFile } from '../config/validate-file-config';

export type ArgsCallback = (config: AppConfig) => void;
export const handleCli: (cb: ArgsCallback) => void = (cb: ArgsCallback): void => {
    // tslint:disable-next-line:no-unused-expression
    const cmd: commander.Command = new commander.Command('Run Manniwatch');
    cmd.version('0.1.0')
        .description('default', {
            endpoint: 'endpoint to query for data',
        })
        .option('-e, --endpoint <endpoint>', 'Data Url Endpoint')
        .option('-c, --config <path>', 'External config file to use')
        .option('-d, --debug', 'Enables debug mode')
        .action(async (options: Partial<ICliConfig>, command: commander.Command): Promise<void> => {
            if (options.debug) {
                console.error('Called %s with options %o', command.name(), options);
            }
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const sourceConfigs: Partial<AppConfig>[] = [require('./../../environment/environment').environment];
            if (options.config) {
                sourceConfigs.push(await loadConfig(options.config));
            }
            if (options.endpoint) {
                sourceConfigs.push({
                    endpoint: options.endpoint,
                });
            }
            if (options.debug) {
                sourceConfigs.push({
                    debug: options.debug,
                });
            }
            const config: AppConfig = mergeAll<AppConfig>(sourceConfigs);
            if (await validateConfigFile(config)) {
                cb(config);
            }
        })
        .parseAsync();
};
