/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import commander from 'commander';
import { IConfig } from './../shared';

export type ArgsCallback = (config: IConfig) => void;
export const parseArgs: (cb: ArgsCallback) => void = (cb: ArgsCallback): void => {
    // tslint:disable-next-line:no-unused-expression
    const cmd: commander.Command = new commander.Command('Run Manniwatch');
    cmd
        .version('0.1.0')
        .arguments('<endpoint>')
        .description('default', {
            endpoint: 'endpoint to query for data',
        })
        .option('-d, --debug', 'Enables debug mode', false)
        .action((endpoint: string, options: { debug: boolean }, command: commander.Command): void => {
            if (options.debug) {
                console.error('Called %s with options %o', command.name(), options);
            }
            console.log(`Uses ${endpoint}`, options);
            cb({
                dev: options.debug,
                endpoint: new URL(endpoint),
            });
        })
        .parse();
};
